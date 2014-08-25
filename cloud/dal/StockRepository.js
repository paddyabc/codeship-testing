var _ = require("underscore");
var Parse = require("cloud/custom/parse");
var AbstractRepository = require("cloud/dal/AbstractRepository");

var StockRepository = function (){

	AbstractRepository.apply(this, ["Stock"]);
};

_.extend(StockRepository.prototype, AbstractRepository.prototype, {

	findByCode: function(code, callback){
		var cacheQuery = new Parse.Query(this.entityName);
		cacheQuery.equalTo("code", code);
		return cacheQuery.find({
		    success:function(results){
		    	if(callback){
			    	if(resutls !== null && results.length > 0)
			    		callback(null, results[0]);
			    	else
			    		callback(null, null);
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


module.exports = StockRepository;