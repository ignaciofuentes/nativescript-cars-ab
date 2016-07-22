var categories =[];
var baseUrl = "http://rollbase-pc1.cohezive.com:9080/GatewayService/";

function findById(source, cvid) {
    return source.filter(function( obj ) {
        return obj.CVID === cvid;
    })[ 0 ];
}
var fetchCategoryRequestObject = {
    ConfigurationData: {
        ConfigurationRequest: {
            ISOCountry: "USA",
            Locale: "en-US",
            RequestData: {
                Request_Categories: "yes",
                Request_Catalogs: "no",
                Request_DisplayFields: "no",
                Request_Parameters: "no"
            }
        }
    }
};
var fetchCategoryCountsRequestObject = {
    CategoryCounts:{
        CategoryCountsRequest:{
            ExpandedResponse:"yes",
            SelectedCategories:{
                CVID:[]
            }
        }
    }
};
var filters = [];

var RollbaseService = function(){
};


RollbaseService.prototype.filters = function(){
    console.log("getting fillter");
    return filters;
}

RollbaseService.prototype.addFilter = function(filter){
    console.log("adding filter");
    if(filters.indexOf(filter)==-1){
        filters.push(filter);
    }
}

RollbaseService.prototype.fetchUpdatedCategoryCounts = function(){
    console.log("about to fetch counts");
    var myRequestObject = fetchCategoryCountsRequestObject;
    myRequestObject.CategoryCounts.CategoryCountsRequest.SelectedCategories.CVID = filters.map(function(f){return f.id});
    var promise = fetch(baseUrl + "getResource?resource=CategoryCount", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(myRequestObject)
            }).then(function (response) {
                console.log("counts retrievded");
                if(response.ok){
                    return response.json();
                }
            },function(error){
                console.log("error");
            }).then(function (result) {
                console.log("counts parsed");
                var categoryCounts = result.CategoryCountsResponse.CategoryValueCounts.CategoryValueCount.map(function(item){
                    return {id:item.CVID, currentCount: item.qty_available};
                });
                return categoryCounts;
            });
    return promise;       
}

RollbaseService.prototype.removeFilter = function(filter){
    filters.splice(filters.indexOf(filter),1);
}

RollbaseService.prototype.fetchCategories = function(){
    console.log("about to fetch categories");
    var promise = fetch(baseUrl + "getResource?resource=ConfigurationData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fetchCategoryRequestObject)
            }).then(function (response) {
                if(response.ok){
                    return response.json();
                }
            }).then(function (result) {
                var categories = result.ConfigurationResponse.Categories.Category;
                return categories;
            });
    return promise;
}


RollbaseService.prototype.fetchCategoryCounts = function(){
    console.log("about to fetch counts");
    var promise = fetch(baseUrl + "getResource?resource=CategoryCount", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fetchCategoryCountsRequestObject)
            }).then(function (response) {
                console.log("counts retrievded");
                if(response.ok){
                    return response.json();
                }
            },function(error){
                console.log("error");
            }).then(function (result) {
                console.log("counts parsed");
                var categoryCounts = result.CategoryCountsResponse.CategoryValueCounts.CategoryValueCount;
                return categoryCounts;
            });
    return promise;       
}

RollbaseService.prototype.fetchCategoriesAndCounts = function(){
    console.log("about to fetch");
    var that = this;
    var promise = Promise.all([that.fetchCategories(),that.fetchCategoryCounts()]).
    then(function(values){
        var categories=values[0];
        var categoryCounts = values[1];
        console.log("got category counts");
        
        var parentCategories = categories.map(function(c){
            var myParentCategory = {id:c.CategoryId ,name:c.Label, order:c.SequenceNo};     
            var values = c.CategoryValues.map(function(cv){
                var myCategory = {id:cv.CVID, name: cv.Label};
                var categoryCount = findById(categoryCounts,cv.CVID);
                myCategory.originalCount = 9999999;
                if(categoryCount){                          
                    myCategory.originalCount = categoryCount.qty_available;
                }
                myCategory.currentCount = 40;
                return myCategory;
            });
            myParentCategory.categories = values;
            return myParentCategory;            
        });           
        if(parentCategories.length > 0){
            console.log("returning sorted parent Categories");
            var sortedByOrder= parentCategories.sort(function(a,b){
                return a.order - b.order 
            });
            return sortedByOrder;
        }
        else {
            console.log("parentCategories are empty");
        }                    
    });            
    return promise;
};

module.exports = new RollbaseService();