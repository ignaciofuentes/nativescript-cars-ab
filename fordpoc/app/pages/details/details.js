var BasePage = require("../../shared/BasePage");
var topmost = require("ui/frame").topmost;
var Observable = require("data/observable").Observable;
var vm = new Observable();
var DetailsPage = function() {
};
DetailsPage.prototype = new BasePage();
DetailsPage.prototype.constructor = DetailsPage;
var contentView;
var car;
var car2;


DetailsPage.prototype.mainContentLoaded = function (args) {
    contentView = args.object;


    var car = fetchData();
    contentView.page.getViewById("pageTitle").title=car.make+ " "+car.model;
    vm.set("imageUrl", car.imageUrl);    
    vm.set("carFavorited", car.favorited);
    
    vm.set("details",[
        {key:"Model", value:car.make+ " "+car.model},
        {key:"Body Style", value:car.body},
        {key:"Year", value:car.year},
        {key:"Exterior", value:car.exterior},
        {key:"Engine", value:car.engine},
        {key:"Transmission", value:car.transmission}]);
    
    contentView.bindingContext = vm;
}


function fetchData() {   
    return contentView.page.navigationContext;
}

module.exports = new DetailsPage();
