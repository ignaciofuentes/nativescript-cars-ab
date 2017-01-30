var token = "";
var appSettings = require("application-settings");
var TNSFancyAlert = require('nativescript-fancyalert').TNSFancyAlert;


function DataService() {
    token = appSettings.getString("token");
}


DataService.prototype.toggleFavorite= function(car){
    if(!car.favorited){
        return fetch("https://api.everlive.com/v1/x2suegnzjxg57ytn/favoriteVehicles",{
            headers:{"Content-Type":"application/json", Authorization: token},
            method: "POST",
            body: JSON.stringify({ VehicleId: car.Id })
            }).then(function(response){
            return response.json();
        });
    }
    else {
        return fetch("https://api.everlive.com/v1/x2suegnzjxg57ytn/favoriteVehicles/"+car.favoritedId,{
            headers:{"Content-Type":"application/json", Authorization: token},
            method: "DELETE",
            }).then(function(response){
            return response.json();
        });
    }

}

DataService.prototype.fetchData = function(favoritesOnly){
    var requestObject = {
        headers: { 
             method: "GET",
            "Authorization": token,
            "X-Everlive-Sort": JSON.stringify({"CreatedAt":-1})
        }
    };
    if(favoritesOnly){
        requestObject.headers["X-Everlive-Custom-Parameters"]=JSON.stringify({favorites:true});
    }
    else delete requestObject.headers["X-Everlive-Custom-Parameters"];
    return fetch("https://api.everlive.com/v1/x2suegnzjxg57ytn/vehicles",requestObject)
    .then(handleErrors)
    .then(function(response){
        return response.json();
    })
    .catch(function(){
        TNSFancyAlert.showError('Oh no!', 'Something went wrong. Please try again', 'Close');

});
}

DataService.prototype.fetchToken = function(username,password){    
    return fetch("https://api.everlive.com/v1/x2suegnzjxg57ytn/oauth/token/",{
        headers:{"Content-Type":"application/json"},
        method: "POST",
        body: JSON.stringify({ username: username, password: password, grant_type:"password" })
    })
    .then(handleErrors)
    .then(function(response){
        return response.json();     
    })
    .then(function(jsonObject){        
        token = "Bearer "+ jsonObject.Result.access_token;
        appSettings.setString("token", token);

        return {success:true};
    })
    .catch(function(){
        return {success:false,errorMessage:"Please check your credentials and try again"}
    });
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error();
    }
    return response;
}

module.exports = DataService;