var Parse = (typeof process.env === 'undefined' ? Parse : require('../../misc/parse'));
Parse.Cloud.useMasterKey();
module.exports = Parse;