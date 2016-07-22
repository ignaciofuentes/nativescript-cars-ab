var Observable = require("data/observable").Observable;
//var geolocation = require("nativescript-geolocation");
var ObservableArray = require("data/observable-array").ObservableArray;


var items = [
        {optionLabel:"1/2 mile", selected: false},
        {optionLabel:"1 mile", selected: false},
        {optionLabel:"5 miles", selected: false},
        {optionLabel:"10 miles", selected: true},
        {optionLabel:"25 miles", selected: false},
        {optionLabel:"Over 50 miles", selected: false}       
    ];
var thing = new ObservableArray(items.map(function(i){return new Observable(i)}));

// ViewModel to be used for our application settings. Might need to be retrieved across the entire app 
var SettingsViewModel = new Observable({
    userLocation: new Observable ({
        radius: 15,
        radiusType: "M",
        long: 0,
        lat: 0,
        postalCode: "",
        state: "MA", // this will eventually be calculated from the zipcode
        city: "Waltham", // this will eventually be calculated from the zipcode
        isoCountry: "USA"
    }),
    useCurrentLocation: false,
    browseByDealer: false,
    toggleCurrentLocationUsage: function() {
       /* var location = this.get("userLocation");
        // this is when we go from false -> true
            if(this.get("useCurrentLocation") === false) {
            if (!geolocation.isEnabled()) {
                geolocation.enableLocationRequest();
            } else {
                var currentLocation = geolocation.getCurrentLocation({desiredAccuracy: 3, updateDistance: 10, timeout: 20000}).
                then(function(loc) {
                    if (loc) {
                        console.log("current latitude: " + loc.latitude);
                        console.log("current longitude: " + loc.longitude);
                        location.set("long", loc.longitude);
                        location.set("lat", loc.latitude);
                        location.set("postalCode", 48120);
                        location.set("state", "MI");
                        location.set("city", "Dearborn");
                    }
                }, function(e) {
                    console.log("Error: " + e.message);
                });           
            }
            location.set("postalCode", "");
            this.set("hintMessage", "");
        }
        // this is when we go from true -> false
        else if(this.get("useCurrentLocation") === true) {
            location.set("long", 0);
            location.set("lat", 0);
            location.set("state", "");
            location.set("city", "");
            location.set("postalCode", "");
            this.set("hintMessage", "Your Zipcode");
        }
        this.set("userLocation", location);
    */},
    toggleBrowseByDealer: function() {
        // TODO: implement what needs to happen upon browsing by dealer (non-funcitonal in the POC)  
    },
    hintMessage: "Your Zipcode",
    items: thing,
    selectedRadius: thing.getItem(3)
});

module.exports = SettingsViewModel;
