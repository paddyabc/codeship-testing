var _ = require("underscore");
var Parse = require("cloud/custom/parse");
var CacheStockInfoRepository = require("cloud/dal/CacheStockInfoRepository");
var StockRepository = require("cloud/dal/StockRepository");

module.exports = {

	updateStockInfo: function(request, status){
		var cacheStockRepo = new CacheStockInfoRepository();
		var stockRepo = new StockRepository();

		var finalPromise = new Parse.Promise();

		stockRepo.findAll(function(error, result){
			if(error)
				finalPromise.reject(error);
			else {
				_.each(result, function(element, index, list){
					var code = element.get("code");
					Parse.Cloud.httpRequest({
                    	url: 'http://www.webservicex.net/stockquote.asmx/GetQuote',
                    	params: { "symbol" : code },
                    	success: function(httpResponse) {
                        	cacheStockRepo.findByStock(element, function(error, result){
                        		if(error)
                        			finalPromise.reject(error);
                        		else {
                        			if(result == null){
                        				var CacheStockInfo = Parse.Object.extend("CacheStockInfo");
										result = new CacheStockInfo();
                        			}

                        			xmlContent = httpResponse.text;
									var openMatch = /&lt;Open&gt;(\d+(\.\d+)?)?&lt;\/Open&gt;/.exec(xmlContent);
									var highMatch = /&lt;High&gt;(\d+(\.\d+)?)?&lt;\/High&gt;/.exec(xmlContent);
									var lowMatch = /&lt;Low&gt;(\d+(\.\d+)?)?&lt;\/Low&gt;/.exec(xmlContent);
									var closeMatch = /&lt;PreviousClose&gt;(\d+(\.\d+)?)?&lt;\/PreviousClose&gt;/.exec(xmlContent);
									var changeMatch = /&lt;Change&gt;([\+,\-]?\d+(\.\d+)?)?&lt;\/Change&gt;/.exec(xmlContent);
									var volumeMatch = /&lt;Volume&gt;(\d+(\.\d+)?)?&lt;\/Volume&gt;/.exec(xmlContent);
									var lastMatch = /&lt;Last&gt;(\d+(\.\d+)?)?&lt;\/Last&gt;/.exec(xmlContent);	

									result.set("open", openMatch ? parseFloat(openMatch[1]) : null);
									result.set("high", highMatch ? parseFloat(highMatch[1]) : null);
									result.set("low", lowMatch ? parseFloat(lowMatch[1]) : null);
									result.set("previousClose", closeMatch ? parseFloat(closeMatch[1]) : null);
									result.set("change", changeMatch ? changeMatch[1] : null);
									result.set("volume", volumeMatch ? parseFloat(volumeMatch[1]) : null);
									result.set("price", lastMatch ? parseFloat(lastMatch[1]) : null);   
									var relation = result.relation("stock");
									relation.add(element);									
									cacheStockRepo.save(result).then(function(){
									    console.log("save success");
									    finalPromise.resolve(result);
									    
									}, function(error){
									    console.log("save fail:" + error.message);
									    finalPromise.reject(error);
									});
                        		}                        		
                        	});
                        }
                    });
				});
			}
		});

		return finalPromise;
	},

	getStockList : function(){
		var stockRepo = new StockRepository();
		var promise = new Parse.Promise();
		stockRepo.findAll(function(error, result){
			if(error)
				promise.reject(error);
			else
				promise.resolve(result);
		});

		return promise;
	}

};