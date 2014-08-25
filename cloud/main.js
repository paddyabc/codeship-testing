var StockController = require("cloud/controller/StockController");
var _ = require("underscore");

Parse.Cloud.job("getStockInfo", function(request, status){

    var controller = new StockController();
    var promise = controller.updateStockInfo(request, status);
    promise.then(
        function(){
            status.success();
        }, 
        function(error){
            status.error(error);
        }
    )
});


Parse.Cloud.define("getStockList", function(req, res){

    var controller = new StockController();
    controller.getStockList().then(function(result){
        var outputArr = [];
        _.each(result, function(element, index, list){
            outputArr.push(element.toJSON());
        });

        res.success(outputArr);
    }, function(error){
        res.error(error);
    });

});

Parse.Cloud.define("controlTest", function(req, res){

    res.success("hello world");

});


Parse.Cloud.define("loadTest", function(req, res){

    var controller = new StockController();
    controller.getStockList().then(function(result){
        /*var outputArr = [];
        _.each(result, function(element, index, list){
            outputArr.push(element.toJSON());
        });

        res.success(outputArr);*/
        controller.getStockList().then(function(result){
            var outputArr = [];
            _.each(result, function(element, index, list){
                outputArr.push(element.toJSON());
            });

            res.success(outputArr);
        }, function(error){
            res.error(error);
        });

    }, function(error){
        res.error(error);
    });

});