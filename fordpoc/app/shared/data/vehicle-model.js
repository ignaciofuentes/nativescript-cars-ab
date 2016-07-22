var FindInventoryData = require("./sample-find-inventory-data").data;
var SettingsViewModel = require("../view-models/settings-view-model");

function VehicleModel() {
    var vehicleModel = {};
    var _listofVehicles = [];
    
    var _createInventoryRequestObject = function(categories, maxVehicles, startResponse) {
        var userLocation = SettingsViewModel.get("userLocation");
        var findInventoryRequest = {
            MaxVehicles: maxVehicles,
            StartResponse: startResponse,
            SelectedCategories: categories,
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
                }
            }
        };
      
      return findInventoryRequest;
    };
    
    /*
        This function will be responsible for calling the endpoint containing our vehicles with the passed request object
    */
    var _callFindInventory = function(findInventoryRequest) {
        // For now we just return our internal list
        return FindInventoryData;
    };
    
    /*
        This goes through the response and creates a model more suitable for the application based on this data
    */
    var _createVehicleList = function(inventoryResponse) {
        var incomingVehicles = inventoryResponse.ExpandedVehicles;
        for(var vehicle of incomingVehicles) {
            var newVehicle = {
                make: vehicle.Brand.Text,
                model: vehicle.VehicleLine.Text,
                year: vehicle.ModelYear.Text,
                imageUrl: "",
                favorited: false,
                features: []
            }
            // this will eventually link to other features
            for(var feature of vehicle.IncludedFeatures) {
                newVehicle.features.push({ featureId: feature.FeatureId });
            }
            _listofVehicles.push(newVehicle);
        }
    };
    
    /*
        Creates a request object to FindInventory, calls the endpoint, then creates a list of vehicles
    */
    vehicleModel.load = function(selectedCategories) {
        var findInventoryRequest = _createInventoryRequestObject(selectedCategories, 25, 1);
        var inventoryResponse = _callFindInventory(findInventoryRequest);
        _createVehicleList(inventoryResponse);
    };
    
    /*
        Returns our internal list of vehicles 
    */
    vehicleModel.getVehicles = function() {
        return _listofVehicles;
    };
    
    return vehicleModel;
}

module.exports = VehicleModel;