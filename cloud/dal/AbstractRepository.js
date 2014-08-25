var _ = require("underscore");

var AbstractRepository = function (name){
	this.entityName = name;

	this.initialize.call(this);
};

_.extend(AbstractRepository.prototype, {

	//default initialization 
	initialize: function (){},

	save: function(saveObj){
		return saveObj.save();
	},

	findAll: function(callback){
		var query = new Parse.Query(this.entityName);
		return query.find({
		    success:function(results){
		    	if(callback)
		    		callback(null, results);
		    }, 
		    error: function(error){
		    	if(callback)
		        	callback(error);
		    }
		});
	}

});

module.exports = AbstractRepository;