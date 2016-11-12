var hiddenProperty = 'hidden' in document ? 'hidden' :
    'webkitHidden' in document ? 'webkitHidden' :
    'mozHidden' in document ? 'mozHidden' :
    null;
var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
var onVisibilityChange = function() {
    if (!document[hiddenProperty]) {
        document.title = "ˇε ˇ 归档"
    } else {
        document.title = ":-( 不要离开我"
    }
}
document.addEventListener(visibilityChangeEvent, onVisibilityChange);
