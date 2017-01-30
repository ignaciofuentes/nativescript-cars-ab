var topmost = require("ui/frame").topmost;
var Observable = require("data/observable").Observable;
var DataService = require("../../shared/DataService");
var vm;
var contentView;
var car1;
var car2;
var ds;

exports.loaded = function (args) {
    vm = new Observable();
    ds = new DataService();
    contentView = args.object;
    var image2 = contentView.getViewById("image2");
    image2.animate({
        scale: { x: -1, y: 1},
        duration: 0
    });
    var response = fetchData();
    car1= response.car1;
    car2= response.car2;
    vm.set("car1", car1);
    vm.set("car2", car2);
    
    vm.set("car1Favorited", car1.favorited);
    vm.set("car2Favorited", car2.favorited);
    
    vm.set("details",[
        {key:"Model", value:{car1:car1.make+ " "+car1.model,car2:car2.make+" "+car2.model}},
        {key:"Body Style", value:{car1:car1.body,car2:car2.body}},
        {key:"Year", value:{car1:car1.year,car2:car2.year}},
        {key:"Exterior", value:{car1:car1.exterior,car2:car2.exterior}},
        {key:"Engine", value:{car1:car1.engine,car2:car2.engine}},
        {key:"Transmission", value:{car1:car1.transmission,car2:car2.transmission}}]);
    
    contentView.bindingContext = vm;
}

exports.favoriteCar1ButtonTapped = function(args) {
    vm.set("car1Favorited", !vm.get("car1Favorited"));
    var car = args.object.bindingContext.car1;
    toggleFavorite(car);
};
exports.favoriteCar2ButtonTapped = function(args) {
    vm.set("car2Favorited", !vm.get("car2Favorited"));
    var car = args.object.bindingContext.car2;
    toggleFavorite(car);
};

exports.car1SelectButtonTapped = function(args) {
    var car = args.object.bindingContext.car1;
    console.log("select button tapped");
    var navigationEntry = {
        moduleName: "pages/details/details",
        context: car,
        animated: true
    };
    topmost().navigate(navigationEntry); 
   
};
exports.car2SelectButtonTapped = function(args) {
    var car = args.object.bindingContext.car2;
    console.log("select button tapped");
    var navigationEntry = {
        moduleName: "pages/details/details",
        context: car,
        animated: true
    };
    topmost().navigate(navigationEntry);  
   
};

function toggleFavorite(car){
    vm.set("isLoading",true);
   ds.toggleFavorite(car).then(function(toggleResponse){
        vm.set("isLoading",false);
        if(toggleResponse.Result.Id){
            car.set("favorited",true);
            car.set("favoritedId", toggleResponse.Result.Id)
        }
        else {
            car.set("favorited", false);
            car.set("favoritedId", null)
        }
    });
}

function fetchData() {
    if(contentView.page.navigationContext){
        return {car1:contentView.page.navigationContext.car1, car2:contentView.page.navigationContext.car2};
    }
    else {
        return {car1:car1, car2:car2}
    };
}
