/**
 * Created by user on 23/06/2017.
 */
let app=angular.module('puzzles',['ngRoute', 'LocalStorageModule']);

app.controller('mainController', ['UserService', 'localStorageService', function (UserService,localStorageService) {
    let vm = this;
    vm.userservice = UserService;
    let cookie=localStorageService.cookie.get("user");
    if(cookie && !vm.userservice.isLoggedIn) {
        let username = cookie['username'];
        data = {username: username, usertoken: cookie['usertoken']};
        vm.userservice.login(data).then(function (success) {
            data = {username: username, token: success['data']};
            localStorageService.cookie.set("user", JSON.stringify(data), 3);
            vm.userservice.username = username;
            $window.alert('You are logged in');
        }, function (error) {
            //self.errorMessage = error.data;
            console.log('login has failed. error: ' + JSON.stringify(error.data));
            //$window.alert('log-in has failed');
        });
    }
}]);

app.controller('restoreController', ['UserService', '$location', '$window' , '$http', function (UserService, $location, $window, $http) {
    let self=this;
    self.user={username:'', answerq:''};
    self.showRestoreQues = false;
    self.restorq="";
    self.getquestion=function(){
        self.data = {username : self.user.username};
        $http.post('/getrestoreq', self.data)
            .then(function (res) {

                if (res['data']!='no such username') {
                    self.restorq = res['data'][0]['restoreQ'];
                }
                else{
                    $window.alert('No such username');
                }
                if(res['data']!='no such username')
                    self.showRestoreQues = true;
            });
    };
    self.nono=function () {
        if(UserService.isLoggedIn)
            $location.path('/home');
    };
    self.chceckans=function(){
        $http.post('RestoreUserPassword', self.user).then(function(res){
            if(res['data']!="wrong answer")
                $window.alert('Your password is: ' + JSON.stringify(res['data']));
            else
                $window.alert('wrong answer');

        })
        self.showRestoreQues = false;
    }
}]);

app.controller('loginController', ['UserService', 'localStorageService','$location', '$window' , function (UserService, localStorageService, $location, $window) {
    let self=this;
    self.user={username:'', password:''};
    self.login=function (valid) {
        if(valid && !UserService.isLoggedIn){
            UserService.login(self.user).then(function (success) {
                if(success.data) {
                    UserService.isLoggedIn=true;
                    data = {username : self.user.username, usertoken: success['data']};
                    localStorageService.cookie.set("user", JSON.stringify(data),3);
                    $window.alert('Welcome!');
                    $location.path('/');
                }
                else{
                    UserService.isLoggedIn=false;
                    $window.alert('wrong password');
                }
            }, function (error) {
                self.errorMessage=error.data;
                $window=alert(error);
            })
        }
    };

    self.nono=function () {
        if(UserService.isLoggedIn)
            $location.path('/home');
    };
}]);

app.controller('registerController', ['UserService','NewUser', '$location', '$window' , '$http', function (UserService, NewUser, $location, $window, $http) {
    let self=this;
    self.ctrs = [];
    self.cities=[];
    self.userservice=UserService;
    self.login=function (valid) {
        if(valid){
            let counter=0;
            let favscats="";
            //self.user={username:'', password:'',firstname:'',lastname:'',answerQ:'',restoreQ:'',email:''};
            angular.forEach(self.cats, function (cat) {
                let name = self.allcategories[counter]['name'];
                if(cat==true){
                    favscats+=name+"|";
                }
                counter++;
            });
            self.user.categories=favscats;
            //self.user['country'] = JSON.stringify(self.user['country']['name']);
            //
            self.user['country']=self.user.country;
            NewUser.login(self.user).then(function (success) {
                if(success.data) {
                    $window.alert('user added!');
                    $location.path('/login');
                }
                else{
                    $window.alert('please select another user name');

                }
            }, function (error) {
                self.errorMessage=error.data;
                $window=alert(error);
            })
        }
    };
    self.nono=function () {
        if(self.userservice.isLoggedIn)
            $location.path('/products');
    };
    self.countrieslist=function(){
        $http.get("countries.xml", {
            transformResponse: function (cnv) {
                var x2js = new X2JS();
                var aftCnv = x2js.xml_str2json(cnv);
                return aftCnv;
            }
        }).then(function (response) {
                response.data.Countries.Country.forEach(function (item) {
                    var name = item.Name;
                    var toAdd = { "name":name};
                    self.ctrs.push(toAdd);
                    self.cities.push(name);
                })
            }
        );

    };

    self.categorieslist=function(){
        $http.get('/allcategories').then(function (res){
            self.allcategories=res.data;
            self.cats=[];
            angular.forEach(self.allcategories, function (cat) {
                let temp = {};
                temp[cat['name']] = false;
                self.cats.push(temp);
            });
        });
    };

    self.catselected=false;
    var options=[false,false,false,false,false,false,false,false];

    self.count=function(cat){
        if(options[cat]===false)
            options[cat]=true;
        else
            options[cat]=false;
        self.catselected=containss(options,true);
    };
    function containss(a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    };
}]);

app.controller('productsController', ['UserService', '$location', '$http', '$window','$location' , function (UserService, $scope, $http, $window,  $location) {
    let self=this;
    self.filter=false;
    self.searching=false;
    self.options=["Price: low to high","price: high to low","No. of Piecces: low to high","No. of Piecces: high to low","Puzzle name: A-Z","Puzzle name: Z-A"];
    self.sortby;
    $scope.isShowRecommended="Show";
    self.userservice=UserService;
    self.data={itemID:'',itemName:'',price:'',category:'',description:'',pieces:'',img:''};
    self.forsearch={text:''};
    self.addto={username:self.userservice.userName};
    self.quantities={};
    var onlyonce1=true;
    var onlyonce8=true;
    var onlyonce=true;
    var onlyonce9=true;
    var onlyonce3=true;
    function catagory(res){
        self.allcategories = res.data;
        self.cats = [];
        angular.forEach(self.allcategories, function (cat) {
            let temp = {};
            temp[cat['name']] = false;
            self.cats.push(temp);
        });
    }
    self.getall=function() {
        if (onlyonce) {
            $http.get("http://localhost:4000/allitems").then(function (recData) {
                var data = [];
                for (var i = 0; i < recData.data.length; i++) {
                    var name = recData.data[i].itemName;
                    data.push("Name: " + name);
                    var artist = recData.data[i].category;
                    data.push("category: " + artist);
                    var cost = recData.data[i].price;
                    data.push("Price: " + cost+" NIS");
                    var picPath = recData.data[i].img;
                    data.push(picPath);
                    var itemid=recData.data[i].itemID;
                    data.push(itemid);
                    var des=recData.data[i].description;
                    data.push("Description: "+des);
                    var pieces=recData.data[i].pieces;
                    data.push("Pieces: "+pieces);
                    self.quantities["Name: " + name]=1;
                }
                self.allitmes = [];
                self.allitmes = chunk(data, 7);
                self.user = {username: self.userservice.userName};
                //self.categorieslist();
                //if(onlyonce9===false) {
                $http.post('/recommendation', self.user)
                    .then(function (res) {
                        recommen(res);
                        $http.get('/allcategories').then(function (res) {
                            catagory(res);
                        });
                    });
                //}

            });
            onlyonce = false;

        }
    };
    function top(){
        //self.quantities={};
        if (onlyonce1) {
            $http.get("http://localhost:4000/top5").then(function (recData) {
                var data = [];
                for (var i = 0; i < recData.data.length; i++) {
                    var name = recData.data[i].itemName;
                    data.push("Name: " + name);
                    var artist = recData.data[i].category;
                    data.push("category: " + artist);
                    var cost = recData.data[i].price;
                    data.push("Price: " + cost+" NIS");
                    var picPath = recData.data[i].img;
                    data.push(picPath);
                    var itemid=recData.data[i].itemID;
                    data.push(itemid);
                    var des=recData.data[i].description;
                    data.push("Description: "+des);
                    var pieces=recData.data[i].pieces;
                    data.push("Pieces: "+pieces);
                    self.quantities["Name: " + name]=1;
                }
                self.top = [];
                self.top = chunk(data, 7);
            });
            onlyonce1 = false;
        }
    }

    self.getall2=function() {
        //self.quantities={};
        self.filter=true;
        self.searching=false;
        //if (onlyonce8) {
        let favscats="";
        let counter=0;
        angular.forEach(self.cats, function (cat) {
            let name = self.allcategories[counter]['name'];
            if(cat==true){
                favscats+=name+" ";
            }
            counter++;
        });
        self.user={category:favscats}
        $http.post('/filterbycategory', self.user)
            .then(function(res) {
                var data = [];
                if(favscats!=""){
                    for (var i = 0; i < res.data.length; i++) {
                        for (var j = 0; j < res.data[i].length; j++) {
                            var name = res.data[i][j].itemName;
                            data.push("Name: " + name);
                            var artist = res.data[i][j].category;
                            data.push("category: " + artist);
                            var cost = res.data[i][j].price;
                            data.push("Price: " + cost+" NIS");
                            var picPath = res.data[i][j].img;
                            data.push(picPath);
                            var itemid=res.data[i][j].itemID;
                            data.push(itemid);
                            var des=res.data[i][j].description;
                            data.push("Description: "+des);
                            var pieces=res.data[i][j].pieces;
                            data.push("Pieces: "+pieces);
                        }

                    }
                }
                else {
                    for (var i = 0; i < res.data.length; i++) {
                        var name = res.data[i].itemName;
                        data.push("Name: " + name);
                        var artist = res.data[i].category;
                        data.push("category: " + artist);
                        var cost = res.data[i].price;
                        data.push("Price: " + cost+" NIS");
                        var picPath = res.data[i].img;
                        data.push(picPath);
                        var itemid=res.data[i].itemID;
                        data.push(itemid);
                        var des=res.data[i].description;
                        data.push("Description: "+des);
                        var pieces=res.data[i].pieces;
                        data.push("Pieces: "+pieces);
                        self.quantities["Name: " + name]=1;
                    }
                }
                self.allitmes = [];
                self.allitmes = chunk(data, 7);
            });
        onlyonce8 = false;
        //}
    };
    var onlyonce2=true;
    self.getnew=function() {
        //self.quantities={};
        if (onlyonce2) {
            $http.get("http://localhost:4000/newproducts").then(function (recData) {
                var data = [];
                for (var i = 0; i < recData.data.length; i++) {
                    var name = recData.data[i].itemName;
                    data.push("Name: " + name);
                    var artist = recData.data[i].category;
                    data.push("category: " + artist);
                    var cost = recData.data[i].price;
                    data.push("Price: " + cost+" NIS");
                    var picPath = recData.data[i].img;
                    data.push(picPath);
                    var itemid=recData.data[i].itemID;
                    data.push(itemid);
                    var des=recData.data[i].description;
                    data.push("Description: "+des);
                    var pieces=recData.data[i].pieces;
                    data.push("Pieces: "+pieces);
                    self.quantities["Name: " + name]=1;
                }
                self.new = [];
                self.new = chunk(data, 7);
            }).then(top);
            onlyonce2 = false;
        }
    };
    self.search=function(){
        //self.quantities={};
        self.searching=true;
        self.filter=false;
        $http.post('/searchproducts', self.forsearch).then(function(res) {
            var data = [];
            for (var i = 0; i < res.data.length; i++) {
                var name = res.data[i].itemName;
                data.push("Name: " + name);
                var artist = res.data[i].category;
                data.push("category: " + artist);
                var cost = res.data[i].price;
                data.push("Price: " + cost+" NIS");
                var picPath = res.data[i].img;
                data.push(picPath);
                var itemid=res.data[i].itemID;
                data.push(itemid);
                var des=res.data[i].description;
                data.push("Description: "+des);
                var pieces=res.data[i].pieces;
                data.push("Pieces: "+pieces);
                self.quantities["Name: " + name]=1;
            }
            self.allitmes = [];
            self.allitmes = chunk(data, 7);
        });
    };
    self.addToCart=function(item){
        self.userto={username:self.userservice.userName};
        if(self.userservice.userName==="guest") {
            $window.alert('must sign-in or register to shop!');
            $location.path('/login');
        }
        else {
            $http.post('/neworderid', self.userto).then(function (res) {
                self.addto['orderid'] = res.data[0].orderid + 1;
                self.addto['itemID'] = item[4];
                self.addto['quentity'] = self.userservice.quantities1[item[4]];
                if (self.userservice.quantities1[item[4]] > 0) {
                    $http.post('/addtocart', self.addto).then(function (res1) {
                        if (res1.data == 'updated')
                            $window.alert('Item updated in cart!');
                        else
                            $window.alert('Item Added to cart!');
                       // self.quantities[item[0]]=self.quantities[item[0]]+1;
                    });
                }
                else {
                    $window.alert('number of items added must be larger than 0');
                }
            });
        }
    };
    self.sort=function(){
        var sortcurrent=self.allitmes;

        function sortprice(a, b) {
            var f=a[2].substring(6);
            f=parseInt(f);
            var s=b[2].substring(6);
            s=parseInt(s);
            if (f === s)
                return 0;
            else
                return (f < s) ? -1 : 1;
        }
        function sortpiecces(a, b) {
            var f=a[6].substring(8);
            f=parseInt(f);
            var s=b[6].substring(8);
            s=parseInt(s);
            if (f === s)
                return 0;
            else
                return (f < s) ? -1 : 1;
        }

        function sortname(a, b) {
            return a[0].localeCompare(b[0]);
        }
        if(self.sortby==="Price: low to high"){
            sortcurrent=sortcurrent.sort(sortprice);
            self.allitmes=sortcurrent;
        }

        else if(self.sortby==="price: high to low"){
            sortcurrent=sortcurrent.sort(sortprice);
            self.allitmes=sortcurrent.reverse();
        }
        else if(self.sortby==="No. of Piecces: low to high"){
            sortcurrent=sortcurrent.sort(sortpiecces);
            self.allitmes=sortcurrent;
        }

        else if(self.sortby==="No. of Piecces: high to low"){
            sortcurrent=sortcurrent.sort(sortpiecces);
            self.allitmes=sortcurrent.reverse();
        }
        else if(self.sortby==="Puzzle name: A-Z"){
            sortcurrent=sortcurrent.sort(sortname);
            self.allitmes=sortcurrent;
        }

        else if(self.sortby==="Puzzle name: Z-A"){
            sortcurrent=sortcurrent.sort(sortname);
            self.allitmes=sortcurrent.reverse();
        }

    };
    self.resetsort=function(){
        self.sortby="";
    };
    self.resettext=function(){
        self.forsearch={text:''};
    };
    function recommen(recData) {
        var data = [];
        self.recommendation = [];
        for (var i = 0; i < recData.data.length; i++) {
            for (var j = 0; j < self.allitmes.length; j++) {
                if (recData.data[i].itemID === self.allitmes[j][4])
                    self.recommendation[i] = self.allitmes[j];
            }
        }
    }
}]);

app.controller('cartController', ['UserService', '$scope', '$http', '$window','$location' , function (UserService, $scope, $http, $window,$location) {
    let self = this;
    self.amount;
    self.addto={};
    self.cart = [];
    self.showde = false;
    self.dar=false;
    self.total = 0;
    self.userservice = UserService;
    self.addto={username:self.userservice.userName};
    self.nono=function () {
        if(!self.userservice.isLoggedIn)
            $location.path('/login');
    };
    self.displayCart = function () {
        self.user = {username: self.userservice.userName};
        self.data = {};
        var adding = [];
        self.cart = [];
        self.total=0;
        $http.post('/displaycart', self.user).then(function (res) {
            $http.get('/allitems').then(function (res1) {
                for (var i = 0; i < res1.data.length; i++) {
                    var id = res1.data[i].itemID;
                    self.data[id] = {};
                    self.data[id]['itemName'] = res1.data[i].itemName;
                    self.data[id]['category'] = res1.data[i].category;
                    self.data[id]['price'] = res1.data[i].price;
                    self.data[id]['img'] = res1.data[i].img;
                    self.data[id]['pieces'] = res1.data[i].pieces;
                    self.data[id]['description'] = res1.data[i].description;
                }
                for (var i = 0; i < res.data.length; i++) {
                    var name = self.data[res.data[i].itemID].itemName;
                    adding.push("Name: " + name);
                    var category = self.data[res.data[i].itemID].category;
                    adding.push("Category: " + category);
                    var cost = self.data[res.data[i].itemID].price;
                    adding.push("Price: " + cost+" NIS");
                    var picPath = self.data[res.data[i].itemID].img;
                    adding.push(picPath);
                    var itemid = res.data[i].itemID;
                    adding.push(itemid);
                    var description = self.data[res.data[i].itemID].description;
                    adding.push("Description: " + description);
                    var pieces = self.data[res.data[i].itemID].pieces;
                    adding.push("Pieces: " + pieces);
                    var quantity = res.data[i].quentity;
                    adding.push("Quantity: " + quantity);
                    self.total += quantity * cost;
                }
                self.cart = chunk(adding, 8);
            });
        });
    };

    self.remove = function (item) {
        self.user = {username: self.userservice.userName, itemID: item[4]};
        $http.post('/deleteproductfromcart', self.user).then(function (res) {
            var date = new Date();
            var curDate = null;
            do {
                curDate = new Date();
            }
            while (curDate - date < 1000);
            self.displayCart();
        });
    };
    self.desopen = function (item) {
        this.selected = item;
        this.showde = !this.showde;
        if (item != null)
            this.det = item;
    };
    self.update=function(item) {
        if (item === null) {
            var date = new Date();
            var curDate = null;
            do {
                curDate = new Date();
            }
            while (curDate - date < 5000);
            self.displayCart();
        }
        else {
            self.userto = {username: self.userservice.userName};
            if (self.userservice.userName === "guest") {
                $window.alert('must sign-in or register to shop!');
                $location.path('/login');
            }
            else {
                $http.post('/neworderid', self.userto).then(function (res) {
                    self.addto['orderid'] = res.data[0].orderid + 1;
                    self.addto['itemID'] = item[4];
                    self.addto['quentity'] = self.userservice.quantities1[item[4]];
                    if (self.userservice.quantities1[item[4]] > 0) {
                        $http.post('/addtocart', self.addto).then(function (res1) {
                        });
                    }
                    else {
                        $window.alert('number of items added must be larger than 0');
                    }
                }).then(function () {
                    var date = new Date();
                    var curDate = null;
                    do {
                        curDate = new Date();
                    }
                    while (curDate - date < 1000);
                    self.displayCart();
                    self.desopen();

                })
            }
        }
    }
}]);

app.controller('historyController', ['UserService', '$scope', '$http', '$window' , function (UserService, $scope, $http, $window){
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    };
    let self=this;
    self.order=[];
    self.cart={};
    self.selected=null;
    self.userservice=UserService;
    self.total=0;
    self.workk=function() {
        self.user={username:self.userservice.userName};
        self.data = {};
        var adding=[];
        $http.post('/showhistory', self.user).then(function (res) {
            $http.get('/allitems').then(function (res1) {
                for(var i=0;i<res1.data.length;i++){
                    var id=res1.data[i].itemID;
                    self.data[id]={};
                    self.data[id]['itemName']=res1.data[i].itemName;
                    self.data[id]['category']=res1.data[i].category;
                    self.data[id]['price']=res1.data[i].price;
                    self.data[id]['img']=res1.data[i].img;
                    self.data[id]['pieces']=res1.data[i].pieces;
                    self.data[id]['description']=res1.data[i].description;
                }
                var dates=[];
                for (var i = 0; i < res.data.length; i++) {
                    var str=res.data[i].orderdate;
                    var short= str.substring(0,str.length-14);
                    dates[i]=short;
                }
                self.order = dates.filter( onlyUnique );

                for(var i=0; i<self.order.length; i++){
                    self.cart[self.order[i]]=[];
                }

                var j=0;
                var i=0;
                while(j<self.order.length-1) {
                    for (; i < res.data.length; i++) {
                        var str=res.data[i].orderdate;
                        var short= str.substring(0,str.length-14);
                        if(self.order[j]==short) {
                            var name = self.data[res.data[i].itemID].itemName;
                            adding.push("Name: " + name);
                            var category = self.data[res.data[i].itemID].category;
                            adding.push("Category: " + category);
                            var description = self.data[res.data[i].itemID].description;
                            adding.push("Description: " + description);
                            var pieces = self.data[res.data[i].itemID].pieces;
                            adding.push("Pieces: " + pieces);
                            var cost = self.data[res.data[i].itemID].price;
                            adding.push("Price: " + cost+" NIS");
                            var picPath = self.data[res.data[i].itemID].img;
                            adding.push(picPath);
                            var Quantity = res.data[i].quantity;
                            adding.push("Quantity: " + Quantity);
                            var date = res.data[i].orderdate;
                            adding.push("On Date: " + date);
                            if(i===res.data.length-1){
                                self.cart[self.order[j]]=chunk(adding,8);
                                adding=[];
                                j=j+1;
                            }
                        }
                        else {
                            self.cart[self.order[j]]=chunk(adding,8);
                            adding=[];
                            j=j+1;
                            if(j===self.order.length)
                                continue;
                            if(i!=res.data.length)
                                i=i-1;
                        }
                    }
                }
            });
        });
    };
    self.calctot=function(){
        self.total=0;
        for(i=0; i<self.cart[self.selected].length;i++){
            self.total=self.total+self.cart[self.selected][i][4].substring(7)*self.cart[self.selected][i][6].substring(10);
        }
    }
}]);

app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
}]);

app.config( ['$routeProvider', function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "public/views/home.html",
            controller : "productsController"
        })
        .when("/home", {
            templateUrl : "public/views/home.html",
            controller : "productsController"
        })
        .when("/login", {
            templateUrl : "public/views/login.html",
            controller : "loginController"
        })
        .when("/register", {
            templateUrl : "public/views/register.html",
            controller : "registerController"
        })
        .when("/products", {
            templateUrl : "public/views/products.html",
            controller : "productsController"
        })
        .when("/restore",{
            templateUrl:"public/views/restore.html",
            controller : "restoreController"
        })
        .when("/cart",{
            templateUrl:"public/views/cart.html",
            controller : "cartController"
        })
        .when("/history",{
            templateUrl:"public/views/history.html",
            controller : "historyController"
        })
        .otherwise({redirect: '/',
        });
}]);

app.factory('UserService', ['$http','localStorageService', function($http, localStorageService) {
    let service = {};
    service.isLoggedIn = false;
    service.userName ="guest";
    service.lastLogin=null;
    self.quantities1={};
    for(i=0;i<20;i++) {
        self.quantities1[i] = 0;
    }
    service.login = function(user) {
        return $http.post('/logint', user)
            .then(function(response) {
                if(response.data){
                    let token=response.data;
                    $http.defaults.headers.common={
                        'usertoken':token, 'username':user.username
                    };
                    service.userName = user.username;
                    service.isLoggedIn = true;
                }
                let LocalStorageLength=localStorageService.length();
                if(LocalStorageLength>0){
                    let valStored=localStorageService.get(service.userName);
                    valStored=localStorageService.get(service.userName+"_time");
                    if(valStored)
                        service.lastLogin=valStored;
                    else
                        service.lastLogin=new Date();
                }
                if (localStorageService.set(service.userName+"_time", new Date())){
                    let valstored=localStorageService.get(service.userName+"_time");
                }
                return Promise.resolve(response);
            })
            .catch(function (e) {
                return Promise.reject(e);
            });
    };
    service.logout = function() {
        service.isLoggedIn = false;
        service.userName ="guest";
        localStorageService.cookie.remove('user');
    };
    return service;
}]);

app.factory('NewUser', ['$http', function($http) {
    let service = {};
    service.isLoggedIn = false;
    service.login = function(user) {
        return $http.post('/adduser', user)
            .then(function(response) {
                return Promise.resolve(response);
            })
            .catch(function (e) {
                return Promise.reject(e);
            });
    };
    return service;
}]);

app.factory('items', ['$http', function($http) {
    let service = {};
    service.isLoggedIn = false;
    service.login = function(user) {
        return $http.get('/allitems', user)
            .then(function(response) {
                return Promise.resolve(response);
            })
            .catch(function (e) {
                return Promise.reject(e);
            });
    };
    return service;
}]);

function chunk(arr, size) {
    var newArr = [];
    for (var i=0; i<arr.length; i+=size) {
        newArr.push(arr.slice(i, i+size));
    }
    return newArr;
}

app.factory('storageService', ['localStorageService', function (localStorageService) {
    let self = this;
    self.value1 = '';
    self.value2 = '';

    self.addData = function () {
        let lsLength = localStorageService.length();
        let valueStored = localStorageService.get(self.key1);
        if (!valueStored) {
            if (localStorageService.set(self.key1, self.value1))
                console.log('data was added successfully');
            else
                console.log('failed to add the data');
        }
        else
            console.log('failed to add the data');

        localStorageService.get(key);
    };
    self.deleteData = function () {
        let valueStored = localStorageService.get(self.key1);
        if (valueStored) {
            localStorageService.remove(self.key1);
            console.log('data was deleted successfully');
        }
        else
            console.log('failed to delete the data');
    };

    self.addCookie = function (key, value) {
        let cookieVal = localStorageService.cookie.get(key);
        if (!cookieVal)
            if (localStorageService.cookie.set(key, value, 3))
                console.log('cookie was added successfully');
            else
                console.log('failed to add the cookie');
        else
            console.log('failed to add the cookie');
    };

    self.deleteCookie = function () {

        let cookieVal = localStorageService.cookie.get(self.cookieKey);
        if (cookieVal) {
            localStorageService.cookie.remove(self.cookieKey);
            console.log('data was deleted successfully');
        }
        else
            console.log('failed to delete the cookie');
    };
}]);