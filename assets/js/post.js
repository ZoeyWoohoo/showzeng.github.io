window.onscroll = function() {
    // console.log(document.body.scrollTop)
    if (document.body.scrollTop >= window.innerHeight) {
        // alert("You should show up");
        document.getElementById('up-to-top').className = 'up-to-top fixed'
    } else {
        document.getElementById('up-to-top').className = 'up-to-top'
    }
}
