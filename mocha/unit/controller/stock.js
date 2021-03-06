var should = require('should');
var Parse = require('cloud/custom/parse');


describe('<Unit Test> StockController', function(){

	var CacheStockInfoRepository = require('cloud/dal/CacheStockInfoRepository');
	var StockRepository = require('cloud/dal/StockRepository');

	describe('updateStockInfo', function(){
		

		it('normal case', function(done) {
			this.timeout(0);

			StockRepository.prototype.findAll = function(callback){

				var obj = new Parse.Object("Stock");
				obj.set('code', '0005.hk');
				obj.set('name', 'HSBC');
				obj.set('id', 'abcdef');

				var output = [obj];

				if(callback)
					callback(null,output);

				var promise = new Parse.Promise();

				setTimeout(function(){
					// console.log("Resolve findAll promise start");
					promise.resolve(output);
					// console.log("Resolve findAll promise end");
				},500);
				
				return promise;
			};
			CacheStockInfoRepository.prototype.findByStock = function (stock,callback){
				/*var obj = new Parse.Object("Stock");
				obj.set('code', '0005.hk');
				obj.set('name', 'HSBC');
				obj.set('id', 'abcdef');

				var output = [obj];*/

				if(callback)
					callback(null, null)

				var promise = new Parse.Promise();

				setTimeout(function(){
					// console.log("Resolve findStock promise start");
					promise.resolve(output);
					// console.log("Resolve findStock promise end");
				},500);

				return promise;
			};

			CacheStockInfoRepository.prototype.save = function(stock){

				var promise = new Parse.Promise();

				setTimeout(function(){
					// console.log("Resolve save promise start");
					promise.resolve(stock);
					// console.log("Resolve save promise end");
				},500);
				
				return promise;

			};

			var StockController = require('cloud/controller/StockController');
			/*
			StockController.updateStockInfo().then(function(objcet){
				should.exists(object);
				object.shoudl.have.property("open").and.a.Number;
				object.should.have.property("high").and.a.Number;
				object.should.have.property("low").and.a.Number;
				object.should.have.property("previousClose").and.a.Number;
				object.should.have.property("change").and.a.String;
				object.should.have.property("volume").and.a.Number;
				object.should.have.property("price").and.a.Number;

				done();
			}, function(error){
				should.not.exists(error);
				done();
			}); 
			*/
			
			StockController.getStockList().then(function(object){
				should.exists(object);
				done();
			}, function(error){
				should.not.exists(error);
				done();
			});
			
		});
	});


});