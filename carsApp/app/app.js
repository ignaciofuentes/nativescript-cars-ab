var application = require("application");
var appSettings = require("application-settings");
var hasToken = appSettings.hasKey("token");
var moduleName;
if(hasToken){  
    moduleName =  "pages/home/home"; 
}
else {
    moduleName = "pages/login/login";  
}
var imageCache = require("nativescript-web-image-cache");
if (application.android) {
    application.onLaunch = function (intent) {
            imageCache.initialize();
    };
}
application.start({ moduleName:  moduleName});

