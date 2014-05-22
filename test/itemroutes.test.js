/*global describe, it, before, beforeEach, after, afterEach */

"use strict";

var Item = require('../app/models/item'),
    itemroutes = require('../app/routes/itemroutes'),
    express = require('./mockexpress'),
    mongoose = require('mongoose'),
    should = require('should'),
    md5 = require('MD5');
    
var db;    
var Route = {};
var sut;

describe('ItemRoutes', function(){
    before(function(done){
        mongoose.connection.removeAllListeners('open');
        mongoose.connect('mongodb://localhost/RetailInventoryTest');
        db = mongoose.connection.on('open', done);
    });
    after(function(done) {
        db.close(done);
    });
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
            express.routePath('/item?number=12345&name=wrench', 'PUT', "", function(req, res) {
                res.status.should.equal(200);
                var ret = JSON.parse(res.sent);
                sut = ret;
                done();
            });
        });
    });
    describe("#post-item", function () {
        it("should update an item when the POST /item  is called", function(done) {
            express.routePath('/item/'+sut._id, 'POST', JSON.stringify(sut), function(req, res) {
                res.status.should.equal(200);
                var ret = JSON.parse(res.sent);
                done();
            });
        });
    });
    describe("#get-item", function () {
        it("should return an item when the GET /item  is called", function(done) {
            express.routePath('/item/'+sut._id, 'GET', "", function(req, res) {
                res.status.should.equal(200);
                var ret = JSON.parse(res.sent);
                done();
            });
        });
    });
    describe("#get-items", function () {
        it("should return a list of items when the GET /item  is called", function(done) {
            express.routePath('/item', 'GET', "", function(req, res) {
                res.status.should.equal(200);
                var ret = JSON.parse(res.sent);
                done();
            });
        });
    });
    describe("#delete-item", function () {
        it("should delete an item when the DELETE /item  is called", function(done) {
            express.routePath('/item/'+sut._id, "", 'DELETE', function(req, res) {
                res.status.should.equal(200);
                JSON.parse(res.sent).should.eql(sut);
                done();
            });
        });
    });
});