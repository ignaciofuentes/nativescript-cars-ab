var Frames = require("ui/frame");
var BasePage = require("../../shared/BasePage");
var FeaturesViewModel = require("../../shared/view-models/features-view-model");
var topmost = require("ui/frame").topmost;
var that;
var filterIndex;
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var dataLoaded;
var vm;

var rollbaseService = require("../../shared/rollbase-service");

var FeaturesPage = function() {
    that = this;
    filterIndex = 0;
    vm = FeaturesViewModel;
    
    dataLoaded = false;
};

FeaturesPage.prototype = new BasePage();
FeaturesPage.prototype.constructor = FeaturesPage;


FeaturesPage.prototype.mainContentLoaded = function(args) {
    var view = args.object;
    view.bindingContext=vm;
    vm.set("filters", rollbaseService.filters().map(function(i){return i.name})); 
    if(!dataLoaded){
        vm.set("isLoading", true);
        vm.set("buttonText","Loading");

        rollbaseService.fetchCategoriesAndCounts().then(function(parentCategories){
            vm.set("buttonText","Show Inventory");
            vm.set("isLoading", false);
            vm.populateWithData(parentCategories);
            dataLoaded = true;                         
        }).catch(function(err){
            console.log(err);
            vm.set("buttonText","Error");
        });        
    }
}

/*
  PageNavigatedTo is called after the Unload event of the details view, so let's use that to check if we need a filter
*/

FeaturesPage.prototype.pageNavigatedTo = function(args) {
 /*   var filterTexts =[
        "500 vehicles found in your area",
        "300 of 500    Fusion",
        "180 of 500   2015  Fusion ",
        "98 of 500   2015  Fusion  AWD"        
    ];
    var vm = FeatureViewModel;
    
    vm.set("filterText",filterTexts[filterIndex]);
    filterIndex++;
    
    
    if(vm.get("filterChanges") === true) {
        vm.filter();
        vm.set("filterChanges", false);
    }*/
}

FeaturesPage.prototype.itemTap = function(args) {
    console.log("test");
    vm.set("selectedParentCategory", args.object.bindingContext);
    
   var navigationEntry = {
        moduleName: "./pages/features-detail/features-detail",
        //context: args.object.bindingContext
    }
    Frames.topmost().navigate(navigationEntry);
   
}

FeaturesPage.prototype.showInventory = function(args) {
    that.viewModel.set("filtersSet",true);
    topmost().navigate("pages/list/list");
}

module.exports =  new FeaturesPage();
