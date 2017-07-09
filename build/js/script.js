$(document).ready(function(){
    $('.button-collapse').sideNav({
        menuWidth: 350, // Default is 300
        edge: 'left', // Choose the horizontal origin
        closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true // Choose whether you can drag to open on touch screens
    }); 
});

$(document).ready(function(){
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
});

window.onload = function(){
    setTimeout(function() {
        document.getElementById('body').className = 'loaded';      
    }, 200);
}

$('.tap-target').tapTarget('open');
$('.tap-target').tapTarget('close');
