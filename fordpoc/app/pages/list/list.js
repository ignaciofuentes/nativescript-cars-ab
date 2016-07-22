var BasePage = require("../../shared/BasePage");
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var topmost = require("ui/frame").topmost;
var vehicleViewModel = require("../../shared/view-models/vehicle-view-model");


var vm;
var view;
var dataLoaded;
var observableCars;
const MAXCARSTOCOMPARE = 2;
var that;
    
var ListPage = function() {
    vm = new Observable();
    observableCars = new ObservableArray([]);
    vm.set("carList", observableCars);
    dataLoaded = false;
    that = this;
    
};
ListPage.prototype = new BasePage();
ListPage.prototype.constructor = ListPage;


ListPage.prototype.mainContentLoaded = function (args) {
    if(that.viewModel.get("filtersSet") ==false){
        goToFiltersPage();
    }
    else {
        that.viewModel.set("selectedPage","list");
        view = args.object;    
        clearItems();
        view.bindingContext = vm;
        vm.set("isLoading",true);
        vm.set("headerLabel","Loading");
        fetchData().then(function(r){
            vm.set("isLoading",false);
            vm.set("total", r.Count);
            vm.set("headerLabel",r.Count+" Results");
            observableCars.push(r.Result.map(function(item){
                item.extraData = [
                    {key:"Engine",value:item.engine},
                    {key:"Transmission",value:item.transmission},
                    {key:"Exterior",value:item.exterior}
                    ];
                return new Observable(item);
            }));
            dataLoaded=true;
        });
    }
};
function clearItems(){
    while(observableCars.length > 0){
        observableCars.pop();
    }
}
function fetchData2(){    
    return fetch("https://api.everlive.com/v1/x2suegnzjxg57ytn/vehicles").then(function(response){
        return response.json();
    });
}

function fetchData3(){
    var list = vehicleViewModel.vehicleList;
    console.log(list);
    var cars =[];
    list.forEach(function(item){
        cars.push({make:item.make,
            model:item.model,
            imageUrl:"https://bs3.cdn.telerik.com/v1/x2suegnzjxg57ytn/13ccc571-f6a2-11e5-9d01-05185dfc4772",
            year:item.year, 
            body:"Coupe",
            exterior:"Race red",
            engine:"3.7L Ti-VCT V6 Engine",
            transmission:"6-Speed Auto",
            favorited:item.favorited
        });
    });
    return new Promise(function(resolve, reject) {
        //simulating network delay
        setTimeout(function(){
            resolve({Count:cars.length, Result:cars});
        }, 1000);
    });
}

function fetchData(){
     var cars = [         
    {id:1,make:"Ford", model:"Fusion", imageUrl:"https://bs1.cdn.telerik.com/v1/x2suegnzjxg57ytn/16dea480-0012-11e6-8f4b-9d53a34f25eb", year:2016, body:"Sedan", exterior:"Magnetic", engine:"2.5L I-4 Engine", transmission:"AWD Auto", favorited:false },
    {id:2,make:"Ford", model:"Fusion", imageUrl:"https://bs3.cdn.telerik.com/v1/x2suegnzjxg57ytn/16de5660-0012-11e6-8f4b-9d53a34f25eb", year:2016, body:"Sedan", exterior:"Oxford White", engine:"2.5L I-4 Engine", transmission:"AWD Auto", favorited:false },
    {id:3,make:"Ford", model:"Fusion", imageUrl:"https://bs3.cdn.telerik.com/v1/x2suegnzjxg57ytn/13cc9e60-f6a2-11e5-9d01-05185dfc4772", year:2016, body:"Sedan", exterior:"Ruby Red", engine:"2.5L I-4 Engine", transmission:"AWD Auto",favorited:true },
    {id:4,make:"Ford", model:"Fusion", imageUrl:"https://bs3.cdn.telerik.com/v1/x2suegnzjxg57ytn/13ccc570-f6a2-11e5-9d01-05185dfc4772", year:2016, body:"Sedan", exterior:"Deep Impact Blue", engine:"2.5L I-4 Engine", transmission:"AWD Auto",favorited:false },
    {id:5,make:"Ford", model:"Fusion", imageUrl:"https://bs3.cdn.telerik.com/v1/x2suegnzjxg57ytn/16de5660-0012-11e6-8f4b-9d53a34f25eb", year:2016, body:"Sedan", exterior:"Oxford White", engine:"1.5L EcoBoost Engine", transmission:"AWD Auto",favorited:false },
    {id:6,make:"Ford", model:"Fusion", imageUrl:"https://bs3.cdn.telerik.com/v1/x2suegnzjxg57ytn/13ccc570-f6a2-11e5-9d01-05185dfc4772", year:2016, body:"Sedan", exterior:"Deep Impact Blue", engine:"2.5L I-4 Engine", transmission:"AWD Auto",favorited:false },
    {id:7,make:"Ford", model:"Fusion", imageUrl:"https://bs3.cdn.telerik.com/v1/x2suegnzjxg57ytn/44270560-0015-11e6-ad34-63103eda3859", year:2016, body:"Sedan", exterior:"Ruby Red", engine:"1.5L EcoBoost Engine", transmission:"Auto",favorited:false },
    {id:8,make:"Ford", model:"Fusion", imageUrl:"https://bs3.cdn.telerik.com/v1/x2suegnzjxg57ytn/44270560-0015-11e6-ad34-63103eda3859", year:2016, body:"Sedan", exterior:"Ruby Red", engine:"2.5L I-4 Engine", transmission:"AWD Auto",favorited:false },
    {id:9,make:"Ford", model:"Fusion", imageUrl:"https://bs3.cdn.telerik.com/v1/x2suegnzjxg57ytn/13ccc570-f6a2-11e5-9d01-05185dfc4772", year:2016, body:"Sedan", exterior:"Deep Impact Blue", engine:"2.5L I-4 Engine", transmission:"AWD Auto",favorited:false },
    {id:10,make:"Ford", model:"Fusion", imageUrl:"https://bs3.cdn.telerik.com/v1/x2suegnzjxg57ytn/16de5660-0012-11e6-8f4b-9d53a34f25eb", year:2016, body:"Sedan", exterior:"Oxford White", engine:"2.5L I-4 Engine", transmission:"AWD Auto",favorited:false },
    {id:11,make:"Ford", model:"Fusion", imageUrl:"https://bs1.cdn.telerik.com/v1/x2suegnzjxg57ytn/16dea480-0012-11e6-8f4b-9d53a34f25eb", year:2016, body:"Sedan", exterior:"Magnetic", engine:"2.5L I-4 Engine", transmission:"AWD Auto",favorited:false },
    
 ];
    return new Promise(function(resolve, reject) {
        //simulating network delay
        setTimeout(function(){
            resolve({Count:98, Result:cars});
        }, 500);
    });
}

function toggleFavorite(car){
    return new Promise(function(resolve, reject) {
        //simulating network delay
        setTimeout(function(){
            resolve(true);
        }, 150);
    });
}

ListPage.prototype.onItemSelected = function(args) {
    console.log("item selected");
    var listView = view.getViewById("car-list");
    observableCars.getItem(args.itemIndex).set("isSelected", true);      
    ListPage.prototype.setCompareButtonVisible(listView.getSelectedItems().length == MAXCARSTOCOMPARE);
    
};

ListPage.prototype.onItemSelecting = function(args) {
    var listView = view.getViewById("car-list");
    if(listView.getSelectedItems().length === 2){
        args.returnValue = false;
    }
};

ListPage.prototype.onItemTap = function(args) {
    console.log("item tapped");
    

    if(!vm.inSelectionMode){
        var navigationEntry = {
            moduleName: "pages/details/details",
            context: observableCars.getItem(args.itemIndex),
            animated: true
        };
        topmost().navigate(navigationEntry);  
    }
    //TODO: perform navigation to cars detail page
};
ListPage.prototype.onItemHold = function(args) {
        console.log("item held");
        var listView = view.getViewById("car-list");
        vm.set("inSelectionMode", true); 
        listView.multipleSelection = true;
        listView.selectionBehavior = "Press";
        listView.selectItemAt(args.itemIndex);      
        ListPage.prototype.setCancelButtonVisibility(true);
};

ListPage.prototype.onItemDeselected = function(args) {
    var listView = view.getViewById("car-list");
    ListPage.prototype.setCompareButtonVisible(listView.getSelectedItems().length == MAXCARSTOCOMPARE);
    observableCars.getItem(args.itemIndex).set("isSelected", false);
};

ListPage.prototype.savedButtonTapped =function(args) {
    console.log("saved Button tapped");
};

ListPage.prototype.cancelButtonTapped = function(args) {
    cancelSelectionMode();
    
};
function cancelSelectionMode(){
    var listView = view.getViewById("car-list");
    deselectAllItems();     
    listView.multipleSelection = false;
    listView.selectionBehavior = "LongPress";
    ListPage.prototype.setCancelButtonVisibility(false);
    ListPage.prototype.setCompareButtonVisible(false);         
    vm.set("inSelectionMode", false);   
}

function deselectAllItems(){
    var listView = view.getViewById("car-list");
    var selectedItems = listView.getSelectedItems();
    for (var i = 0; i < selectedItems.length; i++) {
        var selectedItem = selectedItems[i];
        listView.deselectItemAt(listView.items.indexOf(selectedItem));
        selectedItem.set("isSelected", false);
    }    
}

ListPage.prototype.compareButtonTapped =function(args) {
    var listView = view.getViewById("car-list");
    console.log(listView.getSelectedItems());
    var cars = listView.getSelectedItems();
      
    var navigationEntry = {
        moduleName: "pages/compare/compare",
        context: {car1:cars[0], car2:cars[1]},
        animated: true
        };
    cancelSelectionMode();
    topmost().navigate(navigationEntry);   
};

ListPage.prototype.favoriteButtonTapped = function(args) {    
    var car = args.object.bindingContext;
    vm.set("isLoading",true);
    toggleFavorite(car).then(function(toggleSuccessful){
        vm.set("isLoading",false);
        if(toggleSuccessful){
            car.set("favorited",!car.get("favorited"));
        }
    });
};

ListPage.prototype.filtersButtonTapped = function(args) {
    goToFiltersPage();
};
function goToFiltersPage(){
    var modalPageModule = "pages/features/features";
    var fullscreen = true;
    //TODO: Determine navigation type
    //view.page.showModal(modalPageModule, {}, function closeCallback(username, password) {}, fullscreen);
    topmost().navigate(modalPageModule);
    
}

ListPage.prototype.toggleDrawerTapped = function (args) {
    cancelSelectionMode();
    ListPage.prototype.toggleDrawer(args);
}


module.exports = new ListPage();
