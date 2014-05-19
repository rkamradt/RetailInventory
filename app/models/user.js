"use strict";

var mongoose = require('mongoose'),
    md5 = require('MD5');
    
var UserSchema = new mongoose.Schema({
  email:  { type: String, index: true },
  password: String
});


UserSchema.statics.createNew = function (email, password, cb) {
    if(!email) {
        cb("email is required for user creation");
        return;
    }
    if(!password) {
        cb("password is required for user creation");
        return;
    }
    if(password.length < 8) {
        cb("password must be more than 7 characters long");
        return;
    }
    var self = this;
    this.findOne({'email': email}, function(err, user) {
        if(err) {
            cb(err);
            return;
        }
        if(user) {
            cb("user with email "+email+" already exists");
            return;
        }
        password = md5(password);
        self.create({ email: email, password: password}, cb);
    });
};

UserSchema.statics.findByEmail = function (email, cb) {
    this.findOne({'email': email}, function(err, user) {
        if(!user) {
            err = "user with email " + email + " does not exist";
            cb(err);
            return;
        }
        cb(null, user);
    });
};

UserSchema.statics.verify = function (email, password, cb) {
    this.findOne({ email: email }, function(err, user) {
        if(user.password !== md5(password)) {
            cb("user/password not found");
            return;
        }
        cb();
    });
};

var User = mongoose.model("User", UserSchema);

module.exports = {
    createNew: function(email, password, cb) {
        User.createNew(email, password, cb);   
    },
    findByEmail: function(email, cb) {
        User.findByEmail(email, cb);   
    },    
    verify: function(email, password, cb) {
        User.createNew(email, password, cb);   
    }
};