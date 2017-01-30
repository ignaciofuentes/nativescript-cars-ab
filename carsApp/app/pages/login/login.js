var Observable = require("data/observable").Observable;
var topmost = require("ui/frame").topmost;
var appSettings = require("application-settings");
var TNSFancyAlert = require('nativescript-fancyalert').TNSFancyAlert;
var DataService = require("../../shared/DataService");
var SwissArmyKnife =  require('nativescript-swiss-army-knife/nativescript-swiss-army-knife');

var ds;
var vm;

exports.loaded = function (args){
    vm = new Observable();
    ds = new DataService();
    vm.set("userName","admin");
    vm.set("password","123456");
    args.object.bindingContext = vm;
    SwissArmyKnife.SwissArmyKnife.actionBarSetStatusBarStyle(1);
}

exports.login = function (){
    ds.fetchToken(vm.userName, vm.password).then(function(r){
        if(r.success){
            topmost().navigate({moduleName:"pages/home/home", clearHistory:true });
        }
        else {
            TNSFancyAlert.showError('Authentication failed', r.errorMessage, 'OK');
        }
    }).catch(function(error){
        console.log("failed to log in");
        alert("Something went wrong. Please try again");
    });

}