'use strict';

var _ = require('lodash');
var async = require('async');

function init(Parse) {
    
    var parseObjectSave = Parse.Object.prototype.save;

    Parse.Object.prototype.save = function() {

        var self = this;
        var json = this._toFullJSON();
        var key = json.className;
        var args = Array.prototype.slice.call(arguments);
        var options = args[args.length - 1];

        var parseObject;
        async.series([ function(callback) {

            if (!Parse.Cloud.beforeSaveFunctions || !Parse.Cloud.beforeSaveFunctions[key]) return callback();

            Parse.Cloud.beforeSaveFunctions[key]({
                object: self
            }, {
                success: function() {

                    callback();
                },
                error: function(err) {

                    callback(err);
                }
            });
        }, function(callback) {

            var optionsT = _.extend({}, options);
            optionsT = _.extend(optionsT, {
                success: function(parseObjectT) {

                    parseObject = parseObjectT;
                    callback();
                },
                error: function(err) {

                    callback(err);
                }
            });
            args[args.length - 1] = optionsT;
            parseObjectSave.apply(self, args);
        }, function(callback) {

            if (!Parse.Cloud.afterSaveFunctions || !Parse.Cloud.afterSaveFunctions[key]) return callback();

            Parse.Cloud.afterSaveFunctions[key]({
                object: self
            }, {
                success: function() {

                    callback();
                },
                error: function(err) {

                    callback(err);
                }
            });
        } ], function(err) {

            if (err) return options.error(parseObject, err);
            return options.success(parseObject);
        });

    };

    Parse.Cloud = _.extend(Parse.Cloud, {
        define: function(key, cloudFunction) {

            if (!Parse.Cloud.cloudFunctions) Parse.Cloud.cloudFunctions = {};
            Parse.Cloud.cloudFunctions[key] = cloudFunction;
        },
        run: function(key, params, res) {

//            console.log('Pending to run ' + key);
            process.nextTick(function() {

//                console.log('Start running ' + key);
                if (Parse.Cloud.cloudFunctions && Parse.Cloud.cloudFunctions[key]) {
                    Parse.Cloud.cloudFunctions[key]({
                        params: params
                    }, {
                        success: function() {

//                            console.log('Finish running with success ' + key);
                            res.success(arguments);
                        },
                        error: function() {

//                            console.log('Finish running with error ' + key);
                            res.error(arguments);
                        }
                    });
                }
            });
//            console.log('Pended to run ' + key);
        },
        job: function(key, cloudJob) {

            if (!Parse.Cloud.jobs) Parse.Cloud.jobs = {};
            Parse.Cloud.jobs[key] = cloudJob;
        },
        beforeSave: function(key, beforeSaveFunction) {

            if (!Parse.Cloud.beforeSaveFunctions) Parse.Cloud.beforeSaveFunctions = {};
            Parse.Cloud.beforeSaveFunctions[key] = beforeSaveFunction;
        },
        afterSave: function(key, afterSaveFunction) {

            if (!Parse.Cloud.afterSaveFunctions) Parse.Cloud.afterSaveFunctions = {};
            Parse.Cloud.afterSaveFunctions[key] = afterSaveFunction;
        }
    });

    Parse.initialize('RCAf2YMS8pREuiIxHAEOGQn5ZEUDOtfxqmK5NrVu', 'g4W0kNzY9AtV3zGOBMOLBq8aHhPI9C7yZ5JaHgxs', 'W4gDg12S2iha1ZrnkGanwMNty6Gq89RwoDOpo3Oc');

    return Parse;
}

module.exports = init(require('parse').Parse);