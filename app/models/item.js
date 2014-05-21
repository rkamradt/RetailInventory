"use strict";

var mongoose = require('mongoose');
    
var ItemSchema = new mongoose.Schema({
  number:  { type: String, index: true },
  name: { type: String, index: true }
});


ItemSchema.statics.createNew = function (number, name, cb) {
    if(!number) {
        cb("number is required for item creation");
        return;
    }
    if(!name) {
        cb("name is required for item creation");
        return;
    }
    var self = this;
    this.findOne({'number': number}, function(err, item) {
        if(err) {
            cb(err);
            return;
        }
        if(item) {
            cb("item with number "+number+" already exists");
            return;
        }
        self.create({ number: number, name: name}, cb);
    });
};

ItemSchema.statics.findByNumber = function (number, cb) {
    this.findOne({'number': number}, function(err, item) {
        if(!item) {
            err = "item with number " + number + " does not exist";
            cb(err);
            return;
        }
        cb(null, item);
    });
};

ItemSchema.statics.findByName = function (name, cb) {
    this.findOne({'name': name}, function(err, item) {
        if(!item) {
            err = "item with name " + name + " does not exist";
            cb(err);
            return;
        }
        cb(null, item);
    });
};

var Item = mongoose.model("Item", ItemSchema);

module.exports = {
    createNew: function(number, name, cb) {
        Item.createNew(number, name, cb);   
    },
    findByNumber: function(number, cb) {
        Item.findByNumber(number, cb);   
    },    
    findByName: function(name, cb) {
        Item.findByName(name, cb);   
    },    
    findById: function(id, cb) {
        Item.findById(id, cb);   
    },    
    find: function(conditions, selects, options, cb) {
        Item.find(conditions, selects, options, cb);   
    },    
    save: function(item, cb) {
        Item.findOneAndUpdate({_id: item.id}, item, cb);
    },
    remove: function(id, cb) {
        Item.findByIdAndRemove(id, cb);
    }
};