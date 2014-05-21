/*global describe, it, before, beforeEach, after, afterEach */

"use strict";

var Item = require('../app/models/item'),
    itemroutes = require('../app/routes/itemroutes'),
    express = require('./mockexpress'),
    mongoose = require('mongoose'),
    should = require('should'),
    md5 = require('MD5');
    
    
var Route = {};

describe('ItemRoutes', function(){
    beforeEach(function(done) {
        Route = express.use('/item',itemroutes(express,express.passport));
        done();
    });
    afterEach(function(done) {
        express.clear();
        done();
    });
    describe("#put-item", function () {
        it("should add a new item when the PUT /item  is called", function(done) {
            express.routePath('/item', 'PUT', function(req, res) {
                res.status.should.equal(200);
                res.sent.should.equal('in item put');
                done();
            });
        });
    });
    describe("#post-item", function () {
        it("should update an item when the POST /item  is called", function(done) {
            express.routePath('/item/:id', 'POST', function(req, res) {
                res.status.should.equal(200);
                res.sent.should.equal('in item post');
                done();
            });
        });
    });
    describe("#get-item", function () {
        it("should return an item when the GET /item  is called", function(done) {
            express.routePath('/item/:id', 'GET', function(req, res) {
                res.status.should.equal(200);
                res.sent.should.equal('in item get id');
                done();
            });
        });
    });
    describe("#get-items", function () {
        it("should return a list of items when the GET /item  is called", function(done) {
            express.routePath('/item', 'GET', function(req, res) {
                res.status.should.equal(200);
                res.sent.should.equal('in item get');
                done();
            });
        });
    });
    describe("#delete-item", function () {
        it("should delete an item when the DELETE /item  is called", function(done) {
            express.routePath('/item/:id', 'DELETE', function(req, res) {
                res.status.should.equal(200);
                res.sent.should.equal('in item delete');
                done();
            });
        });
    });
});