var config = require('config/config.json');
var db

exports.connect = function(dbConnection) {
    db = require('monk')(dbConnection);
}

exports.monk = function() {
    if(!db){
        db = require('monk')(config.connectionString);
    }
    return db
}
