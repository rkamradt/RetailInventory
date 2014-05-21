"use strict";

var Item = require('../models/item');

module.exports = function(express, passport){
    var router = express.Router();
    router.use(function(req, res, next) {
    
        console.log(req.method, req.url);
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        
        next();
    });
    router.post('/:id', function(req, res, next) {
        var id = req.params[id];
        var newItem = JSON.parse(req.body);
        var item = Item.findById(id, function(err, item) {
            if(err) {
                res.send(404);
            } else {
                Item.save(newItem, function(err, item) {
                    if(err) {
                        res.json(500, { error: 'could not update item ' + id });
                    } else {
                        res.json(200, item);
                    }
                });
            }
        });
    });
    router.get('/:id', function(req, res){
        var id = req.params[id];
        Item.findById(id, function(err, item) {
            if(err) {
                res.json(404, { error: 'could not create item ' + id });
            } else {
                res.json(200, item);
            }
        });
    });
    router.get('/', function(req, res){
        Item.find(null,null,null, function(err, items) {
            if(err) {
                res.json(500, { error: 'could not create any items'});
            } else {
                res.json(200, items);
            }
        });
    });
    router.put('/', function(req, res){
        var number = req.params[number];
        var name = req.params[name];
        Item.createNew(number,name,function(err, item) {
            if(err) {
                res.json(500, { error: 'could not create item ' + name });
            } else {
                res.json(200, item);
            }
        });
    });
    router.delete('/:id', function(req, res){
        var id = req.params[id];
        Item.remove(id, function(err) {
            if(err) {
                res.send(404);
            } else {
                res.send(200);
            }
        });
    });
    return router;
};

