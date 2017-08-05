//this is only an example, handling everything is yours responsibilty !

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.locals.users = {};
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Cache-Control");
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        return res.end();
    } else {
        return next();
    }
});
var Connection = require('tedious').Connection;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname ));
var cors = require('cors');
app.use(cors());
var DButilsAzure = require('./DBUtil');
var Promise=require('promise');
var config = {
    userName: 'puzzle',
    password: 'cardar1!',
    server: 'puzzle.database.windows.net',
    requestTimeout: 30000,
    options: {encrypt: true, database: 'PuzzleStore'}
};

//-------------------------------------------------------------------------------------------------------------------
connection = new Connection(config);
var connected = false;
connection.on('connect', function(err) {
    if (err) {
        console.error('error connecting: ' + err.message);
    }
    else {
        console.log("Connected Azure");
        connected = true;
    }
});

//-------------------------------------------------------------------------------------------------------------------
app.use(function(req, res, next){
    if (connected)
        next();
    else
        res.status(503).send('Server is down');
});
//-------------------------------------------------------------------------------------------------------------------
var port = 4000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});

/*done------------------------------------------------ AddUser ------------------------------------------------*/
/*add new user only if username isn't taken*/
app.post('/adduser', function (req,res) {
    var username = req.body.username;
    var password = req.body.password;
    var country = req.body.country;
    country=country.replace("\"","");
    country=country.replace("\"","");
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var answerQ=req.body.answerQ;
    var restoreQ = req.body.restoreQ;
    var email = req.body.email;
    var cats=req.body.categories;
    var favoriteCatagoriesList=cats.split("|");
    var alreadyexists=false;
    var preque="select username from users where username='"+username+"'";
    var que = "insert into dbo.Users values('" + username + "','" + password + "','" + country + "','" + firstname + "','" + lastname + "','" + answerQ + "','" + restoreQ + "','" + email + "')";

    var newuser= DButilsAzure.promiseSelect(connection, preque);
    newuser.then(function (ans) {
        if(ans.length==1)
            alreadyexists=true;
    })
        .then(function (ans) {
            if(alreadyexists==true)
                res.send(false);
            else
            {
                DButilsAzure.Insert(que, config);
                for (var i=0;i<favoriteCatagoriesList.length-1;i++)
                {
                    var que2="INSERT INTO dbo.UserCategory VALUES ('"+username+"','"+favoriteCatagoriesList[i]+"')";
                    DButilsAzure.Insert(que2, config);
                }
                res.send(true);
            }
        }).catch( function (err) {
        console.log(err);
    });
});

/*done------------------------------------------------ LoginUser ------------------------------------------------*/
/*login user if password is correct*/
app.post('/logint', function (req,res) {
    var username=req.body.username;
    var password=req.body.password;
    var token=req.body.usertoken;
    let valToken=app.locals.users[username];
    if(token && valToken==token)
        res.json(valToken);
    else if (!password){
        res.send(true);
        res.end();
    }
    else{
        console.log("HI");
    var que="select * from Users where username='"+username+"'AND password='"+password+"'";
    DButilsAzure.Select(connection, que, function (result) {
        if(result.length==1){
            let token=Date.now();
            app.locals.users[username]=token;
            res.json(token);
            //res.send(true);

        }
        else
            res.send(false);
    });
    }
});

/*done------------------------------------------------ TopFive ------------------------------------------------*/
/*display top 5 selling ite"password"ms in past week*/
app.get('/top5', function (req,res) {
    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    var dd = oneWeekAgo.getDate();
    var mm = oneWeekAgo.getMonth()+1; //January is 0!
    var yyyy = oneWeekAgo.getFullYear();
    if(dd<10) {
        dd='0'+dd
    }
    if(mm<10) {
        mm='0'+mm
    }
    var today = yyyy+'-'+mm+'-'+dd;
    var que="select * from (select top 5 itemID from dbo.itemsinorder where orderdate>=Convert(datetime, '"+today+"') group by itemID Order by sum(quantity) DESC) t1 inner join (SELECT * FROM Items) t2 on t1.itemID = t2.itemID";
    DButilsAzure.Select(connection,que, function (result) {
        res.send(result);
    });
});

/*done------------------------------------------------ NewProducts ------------------------------------------------*/
/*display new products in past month*/
app.get('/newproducts', function (req,res) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth(); //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10)
        dd='0'+dd
    if(mm<10)
        mm='0'+mm
    today = yyyy+'-'+mm+'-'+dd;
    console.log(today);
    var que="SELECT * FROM Items where dateadded>='"+today+"'";
    DButilsAzure.Select(connection,que, function (result) {
        res.send(result);
    });
});

/*done------------------------------------------------ AllProducts ------------------------------------------------*/
/*display dictionary where key is product id and value is category*/
app.get('/allitems', function (req,res) {
    //it is just a simple example without handling the answer
    var que='Select itemID,itemName,price,category,description,pieces,img from items';
    var dict = []; // create an empty array

    DButilsAzure.Select(connection,que, function (result) {
        if (result.length == 0)
            console.log('No items to show');
        else
            res.send(result);
    });
});

app.get('/allorders', function (req,res) {
    //it is just a simple example without handling the answer
    var que='Select * from orders';
    var dict = []; // create an empty array

    DButilsAzure.Select(connection,que, function (result) {
        if (result.length == 0)
            console.log('No orders to show');
        else
            res.send(result);
    });
});
app.get('/allcategories', function(req,res){
    var que='Select name from category';
    var dict = []; // create an empty array

    DButilsAzure.Select(connection,que, function (result) {
        if (result.length == 0)
            console.log('No items to show');
        else
            res.send(result);
    });
});
/*done------------------------------------------------ FilterByCategories ------------------------------------------------*/
/*display only products with selected category.
 * category should be sent as: 'category1 category2 category3...'
 *results return as [category1]:items,[category2]:items,... */
app.post('/filterbycategory', function (req,res) {
    var category=req.body.category;
    var nospaces=category.split(" ");
    var list=[];
    var filter= category.replace(/ /g, "' OR category='");
    //console.log(filter);
    var que="";
    if(category==""){
        que="SELECT * FROM Items";
        DButilsAzure.Select(connection,que, function (result) {
            if (result.length == 0)
                console.log('No items to show');
            else
                res.send(result);
        });
    }
    else{
        que="SELECT * FROM Items where category='"+filter+"'";
    DButilsAzure.Select(connection, que, function (result) {
        for(i=0;i<nospaces.length-1;i++){
            var allfromcategory=[];
            for(j=0;j<result.length;j++){
                if(nospaces[i]==result[j].category){
                    allfromcategory[allfromcategory.length]=(result[j]);
                }
            }
            list.push(allfromcategory);
        }
        res.send(list);
    });
    }
});

/*done------------------------------------------------ SortProducts ------------------------------------------------*/
/*sort products: must be sent with property name and order(DESC/ASC)*/
app.post('/sortproducts', function (req,res) {
    var property=req.body.property;
    var order=req.body.order;
    var que="select * from items order by'"+property+"'"+order;
    DButilsAzure.Select(connection, que, function (result) {
        res.send(result);
    });
});

/*done------------------------------------------------ RecommendProducts ------------------------------------------------*/
/*Recommends the user the most popular products from the categories he like. (in the client we will get that list, get list of user's history
 * and not reccomand items he already bought)*/
app.post('/recommendation', function(req,res){
    var username=req.body.username;
    var que="select top 10 count(t1.orderid) as num,t1.itemID, items.itemname, items.category from itemsinorder t1, Items, usercategory where items.itemID=t1.itemID and items.category=usercategory.catname and usercategory.username='"+username+"' group by t1.itemID,items.category,items.itemname order by num desc" ;
    DButilsAzure.Select(connection, que, function (result) {
        if(result.length==0)
        {
            res.send("No recommendations at this time");
        }
        else{
            res.send(result);
        }
    });
});

/*done------------------------------------------------ SearchProduct ------------------------------------------------*/
/*search products: searching in category, description, itemname and price*/
app.post('/searchproducts', function (req,res) {
    var text=req.body.text;
    var que;
    if(text=="")
        que="select * from items";
    else
        que="select * from items where description like '%"+text+"%' OR itemName like'%"+text+"%' OR category like'%"+text+"%' OR convert(decimal(20,10), price) LIKE '%"+text+"%' OR pieces LIKE '%"+text+"%'";
    DButilsAzure.Select(connection, que, function (result) {
        res.send(result);
    });
});

/*done------------------------------------------------ DisplayProduct ------------------------------------------------*/
/*Display Product by id*/
app.post('/DisplayProduct', function (req,res) {
    var itemid=req.body.itemid;
    var que="select * from items where itemID="+itemid;
    DButilsAzure.Select(connection, que, function (result) {
        if(result.length==0)
            res.send('No such product');
        else{
            //var prod=[];
            var result1=result[0];
            var prod={itemname: result1.itemName,
                numleft: result1.numleft,
                price: result1.price,
                category: result1.categoy,
                description: result1.description,
                dateadded: result1.dateadded

            };

            res.send(prod);
        }
        //res.send(result);
    });
});

/*done------------------------------------------------ AddToCart ------------------------------------------------*/
/*Add new product to cart of user. if item already exist in cart, don't add*/
app.post('/addtocart', function (req,res) {
    var itemID=req.body.itemID;
    var username=req.body.username;
    var quantity=req.body.quentity;
    var orderid=req.body.orderid;
    var alreadyexists=false;
    var preque="select username, itemID from Cart where username='"+username+"' and itemID="+itemID;
    var que="insert into Cart (itemID,quentity,username,orderid) values ("+itemID+","+quantity+",'"+username+"',"+orderid+")";
    var que2="update cart set quentity="+quantity+" where username='"+username+"' and itemID="+itemID+" and orderid="+orderid;
    var newproincart= DButilsAzure.promiseSelect(connection, preque);
    newproincart.then(function (ans) {
        if(ans.length==1)
            alreadyexists=true;
    })//make sure the user does not have such product in the cart.
        .then(function (ans) {
            if(alreadyexists==true) {
                DButilsAzure.Insert(que2, config);
                res.send('updated');
            }
            else {
                DButilsAzure.Insert(que, config);
                res.send('added');
            }
        }).catch( function (err) {
        console.log(err);
    });
});

/*done------------------------------------------------ DisplayCart ------------------------------------------------*/
/*presented as array. needed for displaying cart, and later in making order - update inventory and checking if product available in inventory.*/
app.post('/displaycart', function (req,res) {
    var username=req.body.username;
    var que="select * FROM Cart WHERE username='"+username+"'";
    DButilsAzure.Select(connection, que, function (result) {
        if(result.length==0)
            res.send('no items in cart');
        else
            res.send(result);
    });
});

/*done------------------------------------------------ DeleteProductFromCart ------------------------------------------------*/
/*deleteing product from cart. If user doesnt want the product anymore - delete it.*/
app.post('/deleteproductfromcart', function (req,res) {
    var username=req.body.username;
    var itemID=req.body.itemID;
    var que="DELETE FROM Cart WHERE username ='"+username+"' AND itemID="+itemID;
    DButilsAzure.Delete(que, config);
    console.log("HIIIII");
    res.send(true);
});

/*done------------------------------------------------ ShowHistory ------------------------------------------------*/
/*Shows history of purchases for specific user.*/
app.post('/showhistory', function(req,res){
    var username=req.body.username;
    var que="select ItemsInOrder.orderid, ItemsInOrder.itemID, Items.itemName,ItemsInOrder.quantity,ItemsInOrder.price,(ItemsInOrder.price*ItemsInOrder.quantity) as total,ItemsInOrder.orderdate FROM ItemsInOrder,items WHERE ItemsInOrder.itemID=items.itemID and ItemsInOrder.username='"+username+"'";
    DButilsAzure.Select(connection, que, function (result) {
        if(result.length==0)
            res.send('No orderes to show.');
        else
            res.send(result);
    });
});

/*done------------------------------------------------ DisplayOrder ------------------------------------------------*/
/*Returns a specific order with orderID.*/
app.post('/displayorder', function(req,res){
    var orderid=req.body.orderid;
    var username=req.body.username;
    var que="select ItemsInOrder.orderid, ItemsInOrder.itemID, Items.itemName,ItemsInOrder.quantity,ItemsInOrder.price,(ItemsInOrder.price*ItemsInOrder.quantity) as total,ItemsInOrder.orderdate FROM ItemsInOrder,items WHERE ItemsInOrder.itemID=items.itemID and ItemsInOrder.username='"+username+"' and itemsinorder.orderid="+orderid;
    DButilsAzure.Select(connection, que, function (result) {
        if(result.length==0)
            res.send('There\'s no such order');
        else
            res.send(result);
    });
});

/*done------------------------------------------------ MakeOrder ------------------------------------------------*/
/*Making an order: in the client we will check if all products in users cart are in the inventory, if not - delete from cart.
 * add the order into Orders, add all the items in the cart to ItemsInOrder, delete all products from cart of the user. after that
 * function we will update the inventory.*/
app.post('/makeorder', function (req,res) {
    var username=req.body.username;
    var orderid=req.body.orderid;
    var orderdate=req.body.orderdate;

    var intoorders="insert into Orders (orderid,orderdate,username) values ("+orderid+",'"+orderdate+"','"+username+"')"; //Insert order to orders.
    var myP=DButilsAzure.promiseInsert(connection,intoorders);
    myP.then(function(){
        var intoitemsinorder="insert into ItemsInOrder (orderid,itemID,username,quantity, price,orderdate) select orderid,itemID,username,quentity,(select price as price from Items where items.itemID=Cart.itemID),(select orderdate as orderdate from Orders where orders.orderid=Cart.orderid and orders.username='"+username+"') from Cart where username='"+username+"'";
        var myP2=DButilsAzure.promiseInsert(connection,intoitemsinorder); //Insert all the items of the order into itemsinorder.
        myP2.then(function () {
            var updateprice="update Orders set price=(select sum(price*quantity) from ItemsInOrder where orderid="+orderid+" and username='"+username+"') where orderid="+orderid+" and username='"+username+"'";
            DButilsAzure.Update(updateprice,config); //Calculates from all the items whats the total price.

        }).then(function () {
            var deletecart="DELETE FROM Cart WHERE username ='"+username+"'"; //delete all the items from cart.
            DButilsAzure.Delete(deletecart,config);
        }).catch( function (err) {
            console.log(err);
        });

    }).catch( function (err) {
        console.log(err);
        res.send(false);
    });
    res.send(true);
});

/*done------------------------------------------------ AllUsers ------------------------------------------------*/
/*Returns all the users in the database.*/
app.get('/allusers', function (req,res) {
    var que='Select * from Users'
    DButilsAzure.Select(connection,que, function (result) {
        res.send(result);
    });
});

/*done------------------------------------------------ AddProduct ------------------------------------------------*/
/*Adds new product to the table of items in the database.*/
app.post('/addproduct', function (req,res) {
    var itemname=req.body.itemname;
    var numleft=req.body.numleft;
    var price=req.body.price;
    var category=req.body.category;
    var description=req.body.description;
    var img=req.body.img;
    //var dateadded=req.body.dateadded;
    var pieces=req.body.pieces;
    var dateadded1 = new Date();
    dateadded1.setDate(dateadded1.getDate());
    var dd = dateadded1.getDate();
    var mm = dateadded1.getMonth()+1; //January is 0!
    var yyyy = dateadded1.getFullYear();
    if(dd<10) {
        dd='0'+dd
    }
    if(mm<10) {
        mm='0'+mm
    }
    var dateadded = yyyy+'-'+mm+'-'+dd;
    var que="Insert into Items (itemName,numleft,price,category,description, dateadded,pieces,img) values ('"+itemname+"',"+numleft+","+price+",'"+category+"','"+description+"','"+dateadded+"',"+pieces+"'"+img+"')";
    DButilsAzure.Insert(que, config);
    res.send(true);
});

/*done------------------------------------------------ DeleteProduct ------------------------------------------------*/
/*Delete item with itemID from the table of items in the database.*/
app.delete('/deleteproduct', function (req,res) {
    var itemID=req.body.itemID;
    var que="DELETE FROM Items WHERE itemID="+itemID;
    DButilsAzure.Delete(que, config);
    res.send(true);
});

/*done------------------------------------------------ DeleteUser ------------------------------------------------*/
/*Delete user with username.*/
app.delete('/deleteuser', function (req,res) {
    var username=req.body.username;
    var que="DELETE FROM Users WHERE username='"+username+"'";
    DButilsAzure.Delete(que, config);
    res.send(true);
});

/*done------------------------------------------------ UpdateInventory ------------------------------------------------*/
/*Update the quantity in inventory to be the quantity we got*/
app.post('/updateinventory', function(req,res){
    var itemID=req.body.itemID;
    var numleft=req.body.numleft;
    var query="UPDATE Items SET numleft="+numleft+" WHERE itemID="+itemID;
    DButilsAzure.Update(query, config);
    res.send(true);
});

/*done------------------------------------------------ RestoreUserPassword ------------------------------------------------*/
/*provide password if user correctly answerd the restoreQ*/
app.post('/RestoreUserPassword', function (req,res) {
    var username=req.body.username;
    var answerq=req.body.answerq;
    var que="select answerQ,password from users where username='"+username+"'";
    DButilsAzure.Select(connection, que, function (result) {
        if(answerq==result[0].answerQ)
            res.send(result[0].password);
        else
            res.send('wrong answer');
    });
});

/*done------------------------------------------------ GetQuantity ------------------------------------------------*/
/*Returns the quantity of specific item in the inventory. needed for making purchase (get quantity and check if there's enough
 *in inventory and for updating the quantity in inventory).*/
app.post('/getquantity', function(req,res){
    var itemID=req.body.itemID;
    var que="select numleft FROM Items WHERE itemID="+itemID;
    DButilsAzure.Select(connection, que, function (result) {
        if(result.length==0)
            res.send('There\'s no such item');
        else
            res.send(result);
    });
});

/*done------------------------------------------------ InStock ------------------------------------------------*/
/*Check if theres enough in stock of specific item*/
app.post('/instock',function (req,res){
    var itemID=req.body.itemID;
    var quantity=req.body.quantity;
    var que="select numleft from Items where itemID="+itemID;
    DButilsAzure.Select(connection, que, function (result) {
        if(result.length==0)
            res.send('Theres no such item');
        else{
            var left= result[0].numleft;
            if(left-quantity>=0)
            {
                var toReturn= {
                    "isInStock":true,
                    "numleft":0
                }; //if in stock, don't show the user how many left - return 0.
                res.send(toReturn);
            }
            else
            {
                var toReturn= {
                    "isInStock":false,
                    "numleft":left
                };
                res.send(toReturn);//show the user how many left in stock
            }
        }
    });
});

/*done------------------------------------------------ NewOrderID ------------------------------------------------*/
/*MakeOrderID - Our orderid is not autonumbered. for specific user we check how many orders he already made and the next orderid will be the
 * count+1*/
app.post('/neworderid', function (req,res) {
    var username=req.body.username;
    var que="select count(orderid) as orderid from Orders where username='"+username+"'";
    DButilsAzure.Select(connection, que, function (result) {
        if(result.length==0)
        {
            res.send('no such username');
        }
        else{
            res.send(result);
        }
    });
});

/*done------------------------------------------------ GetRestoreQ ------------------------------------------------*/
/*Gets the restore question for specific user*/
app.post('/getrestoreq', function (req,res) {
    var username=req.body.username;
    var que="select restoreQ from Users where username='"+username+"'";
    DButilsAzure.Select(connection, que, function (result) {
        if(result.length==0)
        {
            res.send('no such username');
        }
        else{
            res.send(result);
        }
    });
});

/*done------------------------------------------------ AddAdmin ------------------------------------------------*/
app.post('/addadmin', function (req,res) {
    var username = req.body.username;
    var password = req.body.password;
    var answerQ=req.body.answerQ;
    var restoreQ = req.body.restoreQ;
    var alreadyexists=false;
    var preque="select username from admins where username='"+username+"'";
    var que = "insert into dbo.Admins values('" + username + "','" + password + "','" + restoreQ + "','" + answerQ+ "')";

    var newuser= DButilsAzure.promiseSelect(connection, preque);
    newuser.then(function (ans) {
        if(ans.length==1)
            alreadyexists=true;
    })
        .then(function (ans) {
            if(alreadyexists==true)
                res.send(false);
            else
            {
                DButilsAzure.Insert(que, config);
                res.send(true);
            }
        }).catch( function (err) {
        console.log(err);
    });
});

/*done------------------------------------------------ LoginAdmin ------------------------------------------------*/
/*login user if password is correct*/
app.post('/loginadmin', function (req,res) {
    var username=req.body.username;
    var password=req.body.password;
    var que="select * from Admins where username='"+username+"'AND password='"+password+"'";
    DButilsAzure.Select(connection, que, function (result) {
        if(result.length==1)
            res.send(true);
        else
            res.send(false);
    });
});