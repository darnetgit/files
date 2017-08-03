var modal;
var btn;
var span;

window.onload = function(){
    modal = document.getElementById('myModal');
    btn = document.getElementById("myButton");
    span = document.getElementsByClassName("close")[0];
    modelbox();
};
function modelbox() {
    btn.onclick = function () {
        modal.style.display = "block";
    }
    span.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}