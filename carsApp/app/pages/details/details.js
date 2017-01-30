var topmost = require("ui/frame").topmost;
var Observable = require("data/observable").Observable;
var TNSFancyAlert = require('nativescript-fancyalert').TNSFancyAlert;

var vm;
var page;
var car;
var car2;


exports.loaded = function (args) {
    vm = new Observable();
    page = args.object;
    var car = fetchData();
    vm.set("title",title=car.make+ " "+car.model);
    vm.set("imageUrl", car.imageUrl);    
    vm.set("carFavorited", car.favorited);
    
    vm.set("details",[
        {key:"Model", value:car.make+ " "+car.model},
        {key:"Body Style", value:car.body},
        {key:"Year", value:car.year},
        {key:"Exterior", value:car.exterior},
        {key:"Engine", value:car.engine},
        {key:"Transmission", value:car.transmission}]);
    
    page.bindingContext = vm;
}


exports.optionSelected = function (args) {
    TNSFancyAlert.showInfo('Coming soon!', 'More functionality will be added in the future', 'Close');
}

function fetchData() {   
    return page.navigationContext;
}