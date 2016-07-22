var application = require("application");
var appSettings = require("application-settings");
var appLoadedBefore = appSettings.hasKey("firstTime");
var moduleName;
if(appLoadedBefore){  
    moduleName =  "pages/list/list"; 
}
else {
    moduleName = "pages/settings/settings";
    appSettings.setBoolean("firstTime", false);    
}
application.start({ moduleName: moduleName});
