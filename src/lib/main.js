// Import the page-mod API
var pageMod = require("sdk/page-mod");
var prefs = require("sdk/preferences/service");
var { PrefsTarget } = require("sdk/preferences/event-target");

var darkColor, lightColor, allColors;

// Load the desired system colors once to pass to pageMod
cacheColors();

// Add listener for changes to preferences so colors can be re-loaded
var target = PrefsTarget({branchName: "browser.display."});

target.on("use_system_colors", cacheColors);
target.on("foreground_color", cacheColors);
target.on("background_color", cacheColors);
require('sdk/simple-prefs').on('allColors', cacheColors);

// Create page mod to fix colors
pageMod.PageMod({
  include: /.*/,
  contentScriptFile : './checkContrast.js',
  onAttach: function(worker) {
    //console.log("Contrast: added pagemod for: " + worker.tab.title);
    worker.port.emit("colors", [darkColor, lightColor, allColors]);
  }
});

function cacheColors()
{
    if (prefs.get("browser.display.use_system_colors")) {
        darkColor = "WindowFrame";
        lightColor = "WindowText";
    } else {
        darkColor = prefs.get("browser.display.foreground_color");
        lightColor = prefs.get("browser.display.background_color");
    }
    if (require('sdk/simple-prefs').prefs['allColors'] == true) {
        allColors = true;
    } else {
        allColors = false;
    }

    //console.log("Contrast: caching colors, dark:" + darkColor + ", light:" + lightColor);
}