var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var topmost = require("ui/frame").topmost;
var rollbaseService = require("../../shared/rollbase-service");
var parentCategories;
var observableParentCategories= new ObservableArray([]);

var FeaturesViewModel = function() {
    console.log("creating object");
}

FeaturesViewModel.prototype = new Observable();
FeaturesViewModel.prototype.constructor = FeaturesViewModel;


FeaturesViewModel.prototype.populateWithData = function(pctgs) {
    parentCategories = pctgs;
    console.log("populating view model");
    //converting the whole thing to Observable/ObservableArray
    observableParentCategories.push(parentCategories.map(function(parentCategory){
        var observableParentCat = new Observable({id: parentCategory.id, name:parentCategory.name});
        observableParentCat.set("categories", new ObservableArray(
            parentCategory.categories.map(function(cat){
                var observableCat = new Observable(cat);
                observableCat.isSelected = rollbaseService.filters().indexOf(cat.id)!= -1;
                observableCat.set("countText", "("+observableCat.originalCount+")");
                return observableCat;
            }))
        );
        return observableParentCat;
    }));
    this.set("featureList", observableParentCategories);
}

FeaturesViewModel.prototype.updateCategoryCounts = function(updatedCategoryCounts) {
    
    observableParentCategories.forEach(function(parentCategory){
        parentCategory.categories.forEach(function(cat){
            updatedCategoryCount = updatedCategoryCounts.filter(function(item){
                return item.id === cat.id;
            })[0];
            if(updatedCategoryCount){
                cat.set("currentCount", updatedCategoryCount.currentCount);
                if(rollbaseService.filters().length > 0){
                    cat.set("countText", "(" + cat.currentCount + " of " + cat.originalCount +")");
                }
                else {
                    cat.set("countText", "(" + cat.originalCount + ")");
                }
            }
        })
    });
    
}




module.exports = new FeaturesViewModel();