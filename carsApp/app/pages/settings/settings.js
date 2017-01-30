var appSettings = require("application-settings");
var topmost = require("ui/frame").topmost;

var page;
exports.pageLoaded = function(args) {
  page = args.object;
};

exports.toggleDrawer = function() {
  page.getViewById("drawer").toggleDrawerState();
}

exports.navigate = function(args) {
  var pageName = args.view.text.toLowerCase();
  topmost().navigate("pages/" + pageName + "/" + pageName);
}
exports.logout = function(){
  appSettings.remove("token");
  topmost().navigate({moduleName:"pages/login/login", clearHistory:true });
}