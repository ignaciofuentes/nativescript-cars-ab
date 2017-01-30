var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var topmost = require("ui/frame").topmost;
var DataService = require("../../shared/DataService");
var SwissArmyKnife=  require('nativescript-swiss-army-knife/nativescript-swiss-army-knife');

var vm;
var page;
var dataLoaded;
var observableCars;
const MAXCARSTOCOMPARE = 2;
var ds;
var listView;

exports.pageLoaded = function (args) {
    if(!dataLoaded){
        ds = new DataService();
        vm = new Observable();
        observableCars = new ObservableArray([]);
        vm.set("carList", observableCars);
        dataLoaded = false;
        SwissArmyKnife.SwissArmyKnife.actionBarSetStatusBarStyle(1);
        vm.set("selectedPage","home");
        page = args.object;  
        listView = page.getViewById("car-list");  
        setCancelButtonVisibility(false);
        setCompareButtonText(compareButtonText());
        vm.set("headerLabel", headerLabel);
        page.bindingContext = vm;
        console.log("loaded");
        vm.set("isLoading",true);
        ds.fetchData(false).then(processResponse);
    }
};

exports.navigate = function(args) {
  var pageName = args.view.text.toLowerCase();
  topmost().navigate("pages/" + pageName + "/" + pageName);
}

exports.onItemSelected = function(args) {
    observableCars.getItem(args.itemIndex).set("isSelected", true);
    setCompareButtonText(compareButtonText());
};

exports.onItemSelecting = function(args) {
    if(listView.getSelectedItems().length === 2){
        args.returnValue = false;
    }
};

exports.onItemTap = function(args) {
    if(!vm.inSelectionMode){
        var navigationEntry = {
            moduleName: "pages/details/details",
            context: observableCars.getItem(args.itemIndex),
            animated: true
        };
        topmost().navigate(navigationEntry);  
    }
};

exports.onItemDeselected = function(args) {
    setCompareButtonText(compareButtonText());
    observableCars.getItem(args.itemIndex).set("isSelected", false);
};

exports.savedButtonTapped =function(args) {
    clearItems();
    vm.set("isLoading",true);
    vm.set("favoriteMode",true);
    ds.fetchData(true).then(processResponse);
};

exports.filtersButtonTapped =function(args) {
    clearItems();
    vm.set("isLoading",true);
    vm.set("favoriteMode",false);
    ds.fetchData(false).then(processResponse);
};

exports.cancelButtonTapped = function(args) {
    cancelSelectionMode();    
};

exports.compareButtonTapped =function(args) {
    var cars = listView.getSelectedItems();
    if(cars.length === MAXCARSTOCOMPARE){              
        var navigationEntry = {
            moduleName: "pages/compare/compare",
            context: {car1:cars[0], car2:cars[1]},
            animated: true
            };
        cancelSelectionMode();
        topmost().navigate(navigationEntry);
    }
    else if(cars.length===0){
        enterSelectionMode();
    }
};

exports.favoriteButtonTapped = function(args) {    
    var car = args.object.bindingContext;
    vm.set("isLoading",true);
    ds.toggleFavorite(car).then(function(toggleResponse){
        if(toggleResponse.Result.Id){
            car.set("favorited",true);
            car.set("favoritedId", toggleResponse.Result.Id)
        }
        else {
            car.set("favorited", false);
            car.set("favoritedId", null);
            if(vm.favoriteMode){
                observableCars.splice(observableCars.indexOf(car),1);
            }
        }
        vm.set("isLoading",false);
    });

};


exports.toggleDrawerTapped = function (args) {
    cancelSelectionMode();
    toggleDrawer(args);
}

function enterSelectionMode(args) {
        listView.multipleSelection = true;
        listView.selectionBehavior = "Press";
        vm.set("inSelectionMode", true);
        setCancelButtonVisibility(true);
        setCompareButtonText(compareButtonText());
};

function toggleDrawer() {
  page.getViewById("drawer").toggleDrawerState();
}

function cancelSelectionMode(){
    deselectAllItems();    
    vm.set("inSelectionMode", false);  
    listView.multipleSelection = false;
    listView.selectionBehavior = "None";
    setCancelButtonVisibility(false);
    setCompareButtonText(compareButtonText());        
  
}

function deselectAllItems(){
    var selectedItems = listView.getSelectedItems();
    for (var i = 0; i < selectedItems.length; i++) {
        var selectedItem = selectedItems[i];
        listView.deselectItemAt(listView.items.indexOf(selectedItem));
        selectedItem.set("isSelected", false);
    }    
}

function setCompareButtonText(text){
    vm.set("compareButtonText", text);
}

function compareButtonText(){
     var cars = listView.getSelectedItems();
     if(!vm.inSelectionMode){
         return "Compare";
     }
     else if(cars.length< MAXCARSTOCOMPARE){
         return "Pick "+ MAXCARSTOCOMPARE;
     }
     else return "Go";
}

function processResponse(r){
    observableCars.push(r.Result.map(function(item){
        item.extraData = [
            {key:"Engine",value:item.engine},
            {key:"Transmission",value:item.transmission},
            {key:"Exterior",value:item.exterior}
            ];
        return new Observable(item);
    }));
    dataLoaded=true;
    vm.set("isLoading",false);
};

function clearItems(){
    observableCars.splice(0,observableCars.length);
}

function setCancelButtonVisibility(visible){
    vm.set("cancelButtonVisible", visible);
}

function headerLabel (value, isLoading ,carList) {
    if(isLoading)
    {
        return "Loading";
    }
    else {
        return carList.length+" Results";
    }
}