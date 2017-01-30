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
application.start({ moduleName:  moduleName});

