var _ = require("underscore");
var Parse = require("cloud/custom/parse");
var AbstractRepository = require("cloud/dal/AbstractRepository");

var CacheStockInfoRepository = function (){

	AbstractRepository.apply(this, ["CacheStockInfo"]);
};

_.extend(CacheStockInfoRepository.prototype, AbstractRepository.prototype,{

	findByStock: function(stock, callback){
		var cacheQuery = new Parse.Query(this.entityName);
		cacheQuery.equalTo("stock", stock);
		return cacheQuery.find({
		    success:function(results){

		    	if(callback){
			    	if(results !== null && results.length > 0){			    		
			    		callback(null, results[0]);
			    	}
		    	} else {
		    		callback(null, results);
		    	}

		    }, 
		    error: function(error){
		    	if(callback)
		        	callback(error);
		    }
		});
	}

});


module.exports = CacheStockInfoRepository;