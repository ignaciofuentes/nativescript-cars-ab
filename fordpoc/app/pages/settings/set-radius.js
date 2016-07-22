var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var SettingsViewModel = require("../../shared/view-models/settings-view-model");
var selected;
function loaded(args){
    var page = args.object;
    var listView = page.getViewById("radiusList");
    console.log("here")
    var page = args.object;
    page.bindingContext = SettingsViewModel;    
    selected = SettingsViewModel.selectedRadius;
    if(selected){
        listView.selectItemAt(SettingsViewModel.items.indexOf(selected));
    }
}

function onItemSelected(args){
    SettingsViewModel.items.forEach(function(i){
        i.set("selected",false);
    })
    console.log("selecting " +args.itemIndex);
    var obs = SettingsViewModel.items.getItem(args.itemIndex);
    if(obs){
        obs.set("selected", true);
        SettingsViewModel.set("selectedRadius", obs);
    }
}




exports.onItemSelected= onItemSelected;


exports.loaded = loaded;