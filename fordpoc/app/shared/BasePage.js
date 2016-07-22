var topmost = require("ui/frame").topmost;
var Observable = require("data/observable").Observable;

var appViewModel = new Observable();
appViewModel.selectedPage = "list";
appViewModel.set("filtersSet",false);

function BasePage() {
    appViewModel.set("cancelButtonVisible",false);
    appViewModel.set("compareButtonVisible",false);
    
}
BasePage.prototype.viewModel = appViewModel;
BasePage.prototype.loaded = function(args) {
  var page = args.object;
  page.bindingContext = appViewModel;
}
BasePage.prototype.toggleDrawer = function() {
  var page = topmost().currentPage;
  page.getViewById("drawer").toggleDrawerState();
}
BasePage.prototype.navigate = function(args) {
  var pageName = args.view.text.toLowerCase();
  appViewModel.set("selectedPage", pageName);
  topmost().navigate("pages/" + pageName + "/" + pageName);
}

BasePage.prototype.setCancelButtonVisibility = function(visible){
    appViewModel.set("cancelButtonVisible", visible);
}

BasePage.prototype.setCompareButtonVisible = function(visible){
    appViewModel.set("compareButtonVisible", visible);
}
module.exports = BasePage;