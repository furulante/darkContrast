var darkColor;
var lightColor;

self.port.on("colors", function(colors) {
    darkColor = colors[0];
    lightColor = colors[1];
    checkElementContrast(document.getElementsByTagName("html")[0]);
});

function checkElementContrast(element)
{
    // Don't look at non-renderable elements
    switch (element.tagName) {
        case "HEAD":
        case "TITLE":
        case "META":
        case "SCRIPT":
        case "IMG":
        case "STYLE":
            return;
    }

    //console.log("Checking: " + element.tagName);

    var isFgDefined = (getComputedStyle(element).color
                      != getDefaultComputedStyle(element).color);
    var isBgDefined = (getComputedStyle(element).backgroundColor
                       != 'transparent')
                      || (getComputedStyle(element).backgroundColor != 'none');

    if (!isFgDefined && !isBgDefined) {
        // Both undefined, continue with children
        var children = element.children
        for (var i=0; i < children.length; i++) {
            checkElementContrast(element.children[i]);
        }
    } else if (!isFgDefined) {
        element.style.color = darkColor;
    } else if (!isBgDefined) {
        element.style.backgroundColor = lightColor;
    }

    return;
}
