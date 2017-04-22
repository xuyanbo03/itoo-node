//var mongodb = require('./db');
mongodb = require('mongodb');
var settings = require('../settings');

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
};

module.exports = User;

User.prototype.save = function(callback) {
    var user = {
        name: this.name,
        password: this.password,
        email: this.email
    };
    mongodb.MongoClient.connect(settings.uri, function(err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('users', function(err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            collection.insert(user, {
                safe: true
            }, function(err, user) {
                db.close();
                if (err) {
                    return callback(err);
                }
                callback(null, user[0]);
            });
        });
    });
};

User.get = function(name, callback) {
    mongodb.MongoClient.connect(settings.uri, function(err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('users', function(err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            collection.findOne({
                name: name
            }, function(err, user) {
                db.close();
                if (err) {
                    return callback(err);
                }
                callback(null, user);
            });
        });
    });
};