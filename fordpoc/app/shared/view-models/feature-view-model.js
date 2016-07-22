var Observable = require("data/observable").Observable;
var FeatureModel = require("../data/feature-model");
var VehicleViewModel = require("../view-models/vehicle-view-model");

// Call our model and immediately populate it with data
var featureData = new FeatureModel();
featureData.load();
var pageFeatureList = featureData.getFeatureItems();

/*
    The main ViewModel that is used within the Features and Features-Details views.
    featureList contains all of our items/options for filtering and whether or not they are selected (to be used in filtering)
*/
var FeatureViewModel = new Observable({
    featureList: pageFeatureList,
    filter: function() {
        var selectedFeatureFilters = FeatureViewModel.get("featureList");
        var updatedFeatureList = featureData.filter(selectedFeatureFilters);
        FeatureViewModel.set("featureList", updatedFeatureList.itemsToFilter);
        VehicleViewModel.loadVehicles(updatedFeatureList.selectedCategories);
    },
    filterChanges: false
});

module.exports = FeatureViewModel;
