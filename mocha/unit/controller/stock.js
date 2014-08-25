var should = require('should');
var Parse = require('cloud/custom/parse');
var StockController = require('cloud/controller/StockController');

describe('<Unit Test> StockController', function(){

	var CacheStockInfoRepository = require('cloud/dal/CacheStockInfoRepository');
	var StockRepository = require('cloud/dal/StockRepository');

	describe('updateStockInfo', function(){
		

		it('normal case', function(done) {

			StockRepository.prototype.findAll = function(callback){

				var obj = new Parse.Object("Stock");
				obj.set('code', '0005.hk');
				obj.set('name', 'HSBC');
				obj.set('id', 'abcdef');

				var output = [obj];

				return output;
			};
			CacheStockInfoRepository.prototype.findByStock = function (stock,callback){
				var obj = new Parse.Object("Stock");
				obj.set('code', '0005.hk');
				obj.set('name', 'HSBC');
				obj.set('id', 'abcdef');

				var output = [obj];

				if(callback)
					callback(null, output)

				var promise = Parse.Promise();

				promise.resolve(output)

				return promise;
			};

			CacheStockInfoRepository.prototype.save = function(stock){

				var promise = Parse.Promise();

				promise.resolve(stock);
				return promise;

			};


			var controller = new StockController();
			controller.updateStockInfo().then(function(objcet){
				should.exists(object);
				object.shoudl.have.property("open").and.a.Number;
				object.should.have.property("high").and.a.Number;
				object.should.have.property("low").and.a.Number;
				object.should.have.property("previousClose").and.a.Number;
				object.should.have.property("change").and.a.String;
				object.should.have.property("volume").and.a.Number;
				object.should.have.property("price").and.a.Number;

				done();
			});
		});
	});


});