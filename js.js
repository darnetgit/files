var users = {};
users["a"] = "a";
users["test2017"] = "test2017";
var username;

function ConnectUser() {
    var user = $("#uname")[0].value;
    var password = $("#password")[0].value;

    if (users[user] == undefined)
    {
        alert ("User does not exist");
    }
    else if (users[user] != password)
    {
        alert("Wrong Password");
    }
    else        // user connected succesfully
    {
        alert("User " + user + " Connected!");
        username = user;
        $("#gameBoard").show();
        $("#can").hide();
        $("#forsi").hide();
        //switchVisible();
        document.getElementById("logout").style.display="inline";
        document.getElementById("SignInForm").reset();
        document.getElementById("userr").innerHTML="Hello "+username+"!";
        document.getElementById("userr").style.display="inline";
    }
}
function SignUp(){
    username = $("#usname")[0].value;
    users[$("#usname")[0].value]=$("#pasush")[0].value;
    $("#gameBoard").show();
    $("#can").hide();
    $("#forsi").hide();
    openCity(event, 'signin2',1);
    document.getElementById("logout").style.display="inline";
    document.getElementById("SignUpForm").reset();
    document.getElementById("userr").innerHTML="Hello "+username+"!";
        document.getElementById("userr").style.display="inline";

}
function Logout(){
    openCity(event,'welcome2',1);
    $("#gameBoard").hide();
    $("#forsi").show();
    username=undefined;
    document.getElementById("logout").style.display="none";
    document.getElementById("gameush").reset();
    context.clearRect(0, 0, canvas.width, canvas.height);
    $("#lbllives").val('');
    $("#lblTime").val('');
    $("#lblScore").val('');
    gold.currentTime=0;
    gold.pause();
       time_elapsed=0; document.getElementById("userr").style.display="none";
islogout=true;
}
function openCity(evt, cityName, wt) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    if (username !== undefined && cityName === "signup2")
    {
        window.alert("You cannot signup while signed in!");
    }
    else{

        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i = i + 1) {
            tabcontent[i].style.display = "none";
        }

        // Get all elements with class="tablinks" and remove the class "active"
        if (wt == 1)
            tablinks = document.getElementsByClassName("tablinks");
        else
            tablinks = document.getElementsByClassName("tablinks2");
        document.getElementById("welcome2").style.color = "blue";
        document.getElementById("welcome2").style.backgroundColor = "black";
        document.getElementById("signup2").style.color = "blue";
        document.getElementById("signup2").style.backgroundColor = "black";
        document.getElementById("signin2").style.color = "blue";
        document.getElementById("signin2").style.backgroundColor = "black";
        for (i = 0; i < tablinks.length; i = i + 1) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        // Show the current tab, and add an "active" class to the button that opened the tab
        document.getElementById(cityName + "2").style.display = "block";
        document.getElementById(cityName).style.color = "black";
        document.getElementById(cityName).style.backgroundColor = "blue";
        evt.currentTarget.className += " active";
    }
}

var modal = document.getElementById('modal');

// Get the button that opens the modal
var btn = document.getElementById("about");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
    modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

$().ready(function () {
    $("#SignUpForm").validate({
        wrapper: 'span',
        errorPlacement: function (error, element) {
            //error.css({'padding-left':'10px','margin-right':'20px','padding-bottom':'2px'});
            error.addClass("arrow")
            error.insertAfter(element);
        },

        rules: {
            firstname: {
                required: true,
                nowhitespace: true,
                lettersonly: true
            },
            lastname: {
                required: true,
                nowhitespace: true,
                lettersonly: true
            },
            usernane: {
                required: true,
                usernametaken: true
            },

            pass: {
                required: true,
                strongPassword : true

            },
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            firstname: {
                required: 'first name must be entered',
                nowhitespace: 'No white spaces please',
                lettersonly: 'Only letters please'
            },
            lastname: {
                required: 'last name must be entered',
                nowhitespace: 'No white spaces please',
                lettersonly: 'Only letters please'
            },
            usernane: {
                required: 'user name must be entered '
            },
            pass: {
                required: 'Password must be entered',
                min:8

            },
            email: {
                required : 'Email address must be entered',
                email: 'Email address must be valid!'
            }
        }
    });

    $("#startgame").validate({
        wrapper: 'span',
        errorPlacement: function (error, element) {
            //error.css({'padding-left':'10px','margin-right':'20px','padding-bottom':'2px'});
            error.addClass("arrow")
            error.insertAfter(element);
        },

        rules: {
            balls: {
                required: true,
                min: 50,
                max: 90
            },
            time: {
                required: true,
                min: 60
            },
            ghosts: {
                required: true,
                min: 1,
                max:3
            }
        },
        messages: {
            balls: {
                required: 'number of balls must be entered',
                min: 'at least 50 balls',
                max: '90 balls at most'
            },
            ghosts: {
                required: 'number of ghosts must be entered',
                min: 'at least 1 ghost',
                max: 'max of 3 ghosts'
            },
            time: {
                required : 'game time must be entered',
                min: 'you must play for at least 60 seconds'
            }
        }
    });
    $.validator.addMethod('strongPassword', function(value, element) {
        return this.optional(element)
        || value.length >= 8
        && /\d/.test(value)
        && /[a-z]/i.test(value);
    }, 'Your password must be at least 8 characters long and contain at least one number and one char\.')
});
$.validator.addMethod("usernametaken", function (user) {
    return (user in users) == false;
}, "username already taken.");
