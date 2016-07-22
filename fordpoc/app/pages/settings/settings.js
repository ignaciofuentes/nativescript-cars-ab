var Frames = require("ui/frame");
var BasePage = require("../../shared/BasePage");
var SettingsViewModel = require("../../shared/view-models/settings-view-model");
var topmost = require("ui/frame").topmost;

var SettingsPage = function() {
    this.viewModel.set("selectedPage","settings");
};
SettingsPage.prototype = new BasePage();
SettingsPage.prototype.constructor = SettingsPage;

SettingsPage.prototype.mainContentLoaded = function(args) {
    var  view = args.object;
    var  vm = SettingsViewModel;
    view.bindingContext = vm;
    
}

SettingsPage.prototype.locationSwitchChanged = function(args) {
    if(args.propertyName === "checked") {
        var  vm = SettingsViewModel;
        vm.toggleCurrentLocationUsage();
    }
}

SettingsPage.prototype.dealerSwitchChanged = function(args) {
      if(args.propertyName === "checked") {
          var  vm = SettingsViewModel;
          vm.toggleBrowseByDealer();
    }  
}

SettingsPage.prototype.searchRadiusTapped = function(args) {
     topmost().navigate("pages/settings/set-radius");
}

SettingsPage.prototype.showInventory = function(args) {
    topmost().navigate("pages/list/list");
}

module.exports = new SettingsPage();
