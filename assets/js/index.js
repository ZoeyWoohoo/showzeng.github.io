var transformHeight = document.getElementById('header-bg').offsetHeight - document.getElementById('nav-bar').offsetHeight;

window.onscroll = function() {
    // console.log(document.body.scrollTop)
    if (document.body.scrollTop >= transformHeight) {
        document.getElementById('nav-bar').className = 'nav-bar nav-bar-fixed'
        document.getElementById('nav-bar-avatar').className = 'nav-bar-avatar small'
        document.getElementById('nav-bar-title').className = 'nav-bar-title small'
        document.getElementsByClassName('nav-bar-title')[0].innerHTML = 'showzeng'
    } else {
        document.getElementById('nav-bar').className = 'nav-bar'
        document.getElementById('nav-bar-avatar').className = 'nav-bar-avatar'
        document.getElementById('nav-bar-title').className = 'nav-bar-title'
        document.getElementsByClassName('nav-bar-title')[0].innerHTML = '写代码的小超超'
    }
}

function mouseOver() {
    if (document.body.scrollTop >= transformHeight) {
        document.getElementById('avatar').style.transform = "rotate(360deg)";
        document.getElementById('avatar').style.transition = "0.5s linear";
    } else {
        console.log(不要管我);
    }
}

function mouseOut() {
    if (document.body.scrollTop >= transformHeight) {
        document.getElementById('avatar').style.transform = "rotate(-360deg)";
        document.getElementById('avatar').style.transition = "0.5s linear";
    } else {
        console.log(请无视我);
    }
}

var hiddenProperty = 'hidden' in document ? 'hidden' :
    'webkitHidden' in document ? 'webkitHidden' :
    'mozHidden' in document ? 'mozHidden' :
    null;
var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
var onVisibilityChange = function() {
    if (!document[hiddenProperty]) {
        document.title = "ˇε ˇ showzeng's blog"
    } else {
        document.title = ":-( 不要离开我"
    }
}
document.addEventListener(visibilityChangeEvent, onVisibilityChange);
