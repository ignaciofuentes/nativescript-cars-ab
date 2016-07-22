var FeaturesViewModel = require("../../shared/view-models/features-view-model");
var rollbaseService = require("../../shared/rollbase-service");

var observableCategories;
var vm;
var page;
var detailsListView;
var selectedItems;
var listView;
var that;


var FeaturesDetailPage = function() {    
    vm = FeaturesViewModel;
    that = this;
};

function setFilterState(){
    vm.set("filtersSet", rollbaseService.filters().length > 0);
}

FeaturesDetailPage.prototype.loaded = function(args) {
    observableCategories = vm.selectedParentCategory.categories;
    console.log("loaded?");
    page = args.object;
    detailsListView = page.getViewById("detailsListView");
    setFilterState();
    page.bindingContext = vm;
    vm.set("filtersText", rollbaseService.filters().length);
}

// See the Details ListView
FeaturesDetailPage.prototype.onItemSelected = function(args) {
    var category = observableCategories.getItem(args.itemIndex);
    if(category.isSelected){
        that.onItemDeselected(args);
    }
    else {
        rollbaseService.addFilter(category);
        vm.set("isLoading", true);
        rollbaseService.fetchUpdatedCategoryCounts().then(function(updatedCategoryCounts){
            category.set("isSelected",true);
            vm.updateCategoryCounts(updatedCategoryCounts);
            setFilterState();
            vm.set("filtersText", rollbaseService.filters().length);
            vm.set("isLoading", false);       
        }).catch(function(error) {

            console.log(error);
            console.log("error");
        });
    }
}

FeaturesDetailPage.prototype.onItemDeselected = function(args) {
    var category = observableCategories.getItem(args.itemIndex);
    category.set("isSelected",false);
    rollbaseService.removeFilter(category);
    vm.set("isLoading", true);
    rollbaseService.fetchUpdatedCategoryCounts().then(function(updatedCategoryCounts){        
        vm.updateCategoryCounts(updatedCategoryCounts);
        setFilterState();
        vm.set("filtersText", rollbaseService.filters().length);
        vm.set("isLoading", false);        
    }).catch(function(error) {

        console.log(error);
        console.log("error");
    });
}

module.exports = new FeaturesDetailPage();
