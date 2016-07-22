var SampleData = require("./sample-filter-vehicle-data").data;
var SampleModelData = require("./sample-configuration-data").data;
var CategoryCountsData = require("./sample-category-counts-data").data;
var SettingsViewModel = require("../view-models/settings-view-model");

function FeatureModel() {
  var featureModel = {};
  var _internalPrimaryModel = {};
  var _retrievedModelData = {};
  var _retrievedData = {};
  var _featureItems = [];
  var _categoryCount = [];
  
  /*
      This is where we would call our API endpoint, for now we will deal with hard-coded data
  */
  var _retrieveFeatureItems = function() {
    _retrievedModelData = SampleModelData;
    _retrievedData = SampleData;
    
    return _retrievedModelData;
  };
  
  /* 
    This function will be responsible for querying the category counts
  */
  var _retrieveCategoryCounts = function(categoryCountsRequest) {
    _categoryCount = CategoryCountsData;
    return _categoryCount;
  };
  
  /*
    Based on selected items, let's create the request object for CategoryCount
  */
  var _createCategoryCountsRequest = function(listOfFeatures) {
      var userLocation = SettingsViewModel.get("userLocation");
      var categoryCountsRequest = {
          ExpandedResponse: "yes",
          SelectedCategories: [],
          Scope: {
              UserLocation: {
                  Radius: userLocation.get("radius"),
                  RadiusType: userLocation.get("radiusType"),
                  GPSLocation: {
                      Long: userLocation.get("long"),
                      Lat: userLocation.get("lat")
                  },
                  UserProvided: {
                      PostalCode: userLocation.get("postalCode"),
                      ISOCountry: userLocation.get("isoCountry")
                  }
              },
              SelectedDealer: {
                  DealerId: "None"
              }
          }
      };
      var selectedCategories = _getSelectedCategories(listOfFeatures);
      
      for(feature in listOfFeatures) {
          var featureCVID = {
              CIVD: listOfFeatures[feature].CVID
          };
          categoryCountsRequest.SelectedCategories.push(featureCVID);
      }
      
      return categoryCountsRequest;  
  };
  
  /*
    Currently this simply grabs the Categories and passes them on, but eventually this method will be used
    to customize how our model should look if we need more in-depth modification of the incoming data
  */
  var _createPrimaryFeaturesModel = function(features) {
      //define our model by looking at a single data item that has been retrieved
      var primaryFeature = {};
      primaryFeature = features.Categories;

      _internalPrimaryModel = primaryFeature;
      return primaryFeature;
  };
  
  /* Check to see if this configuration data is listed multiple times
     may not be needed with the CategoryCounts call
  */
  var _checkForExistingValue = function(valueToCheck, currentFeatureList) {
      var foundFeature = false;
      for (var currentFeature in currentFeatureList) {
          if(currentFeatureList[currentFeature].text === valueToCheck) {
              foundFeature = true;
              currentFeatureList[currentFeature].count++;
          }
      }
      return foundFeature;
  };
  
  /* Find the qty_available from the CategoryCounts call based on CVID
   If one is not found we will just make it since it should not exist
  */
  var _checkItemCount = function(cvid, counts) {
      var categoryCounts = counts;
      var foundCount = 0;
      for (var count of categoryCounts) {
          if(count.id === cvid) {
              foundCount = count.qty_available;
          }
      }
      
      return foundCount;
  };
  
  /* Create our Feature Items to be displayed when filtering.
     Each item has a primary label related to the parent CategoryId and Label from the backend object
     Then the "items" collection contains all of the CategoryValues in question along with their current and original counts
     Current: the current count is based on our selection.
     Original: the total number from the first call to the endpoint
  */ 
  var _createFeatureList = function(categories, counts) {
      for (var category in categories) {
          var featureItem = {};
          featureItem.FilterLabel = categories[category].Label;
          featureItem.items = [];
          var categoryValues = categories[category].CategoryValues;
          for (var item of categoryValues) {
              var currentValue = item.Label;
              var checkForValue = _checkForExistingValue(currentValue, featureItem.items);
              var itemCount = _checkItemCount(item.CVID, counts.CategoryValuesCounts);
              if(checkForValue === false) {
                featureItem.items.push({
                    text: currentValue,
                    currentCount: itemCount, // since this is the initial load, this will be equal to the original count
                    originalCount: itemCount,
                    cvid: item.CVID,
                    sequenceNo: item.SequenceNo,
                    selected: false
                });
              }
         }
        _featureItems.push(featureItem);
      }
  };
  
  // Now that we have new counts, lets update the "currentCount" of each item
  var _updateFeatureListCategoryCounts = function(featureItemList, newCategoryCounts) {
       for (var feature in featureItemList) {
          var categoryItems = featureItemList[feature].items;
          for (var category of categoryItems) {
              var itemCount = _checkItemCount(category.cvid, newCategoryCounts); // this will update the internal count
              //category.currentCount = itemCount;
              //faking data
              if(category.currentCount>0){
                category.currentCount = category.currentCount-1;
              }
              //
          }
      }
  }
  
  /*
   Goes through all of our items of our primary feature list and find the ones that are selected in the detail list view
  */
  var _getSelectedCategories = function(itemsToFilter) {
      var selectedCategories = [];
      for(var feature in itemsToFilter) {
          var categoryItems = itemsToFilter[feature].items;
          for(var category in categoryItems) {
              if(categoryItems[category].selected === true) {
                  selectedCategories.push(categoryItems[category]);
              }
          }
      }
      
      return selectedCategories;
  }
  
  /*
    Calls the ConfigurationData and CategoryCount endpoints and merges them in to one model
  */
  featureModel.load = function() {
    var retrievedItems = _retrieveFeatureItems();
    var categoryCountRequest = _createCategoryCountsRequest(retrievedItems);
    var countItems = _retrieveCategoryCounts();
    var primaryFeaturesModel = _createPrimaryFeaturesModel(retrievedItems);
    _createFeatureList(primaryFeaturesModel, countItems);
  };
  
  /*
    Used to retrieve the internal list of items to be featured in the main filtering view
  */
  featureModel.getFeatureItems = function() {
      return _featureItems;
  };
  
  featureModel.filter = function(itemsToFilter) {
      // Extract all of our selected categories
      var selectedCategories = _getSelectedCategories(itemsToFilter);
      
      // Create the request object and retrieve new counts
      var categoryCountsRequest = _createCategoryCountsRequest(selectedCategories);
      var newCategoryCounts = _retrieveCategoryCounts(categoryCountsRequest);
      
      _updateFeatureListCategoryCounts(itemsToFilter, newCategoryCounts.CategoryValuesCounts);
      var returnObject = {
          itemsToFilter: itemsToFilter,
          selectedCategories: selectedCategories
      };
      return returnObject;
  }
  
  return featureModel;
}

module.exports = FeatureModel;
