var Observable = require("data/observable").Observable;
var VehicleModel = require("../data/vehicle-model");

// ViewModel to be used for our Vehicles. Right now this is just used for loading the initial data
// and retrieving a list of vehicles through the internal app model 
var VehicleViewModel = new Observable({
    vehicleList: [],
    loadVehicles: function(SelectedCategories) {
        if(this.get("vehicleList").length === 0) {
            var vehicleData = new VehicleModel();
            vehicleData.load(SelectedCategories);
            this.set("vehicleList", vehicleData.getVehicles());
        }
    }
});

module.exports = VehicleViewModel;
