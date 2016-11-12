window.onscroll = function() {
    // console.log(document.body.scrollTop)
    if (document.body.scrollTop >= window.innerHeight) {
        // alert("You should show up");
        document.getElementById('up-to-top').className = 'up-to-top fixed'
    } else {
        document.getElementById('up-to-top').className = 'up-to-top'
    }
}

var hiddenProperty = 'hidden' in document ? 'hidden' :
    'webkitHidden' in document ? 'webkitHidden' :
    'mozHidden' in document ? 'mozHidden' :
    null;
var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
var onVisibilityChange = function() {
    if (!document[hiddenProperty]) {
        document.title = "ˇε ˇ {{ page.title }}"
    } else {
        document.title = ":-( 不要离开我"
    }
}
document.addEventListener(visibilityChangeEvent, onVisibilityChange);
