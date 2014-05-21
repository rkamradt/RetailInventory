/*global describe, it, before, beforeEach, after, afterEach */

"use strict";

var Item = require('../app/models/item'),
    mongoose = require('mongoose'),
    should = require('should');

var db;

describe('Item', function(){
  before(function(done){
    mongoose.connection.removeAllListeners('open');
    mongoose.connect('mongodb://localhost/RetailInventoryTest');
    db = mongoose.connection.on('open', done);
  });
  after(function(done) {
      db.close(done);
  });
  beforeEach(function(done) {
      Item = db.model('Item');
      Item.remove({},done);
  });
  describe('#createNew()', function() {
    it('should save without error if specified correctly', function(done) {
      Item.createNew('12345', 'bolt', function(err, item) {
          should.not.exist(err);
          should.exist(item);
          should.exist(item.number);
          should.exist(item.name);
          item.number.should.equal('12345');
          item.name.should.equal('bolt');
          done();
      });
    });
    it('should error if no number is present', function(done) {
      Item.createNew(null, 'washer', function(err, item) {
          should.exist(err);
          err.should.equal('number is required for item creation');
          done();
      });
    });
    it('should error if no name is present', function(done) {
      Item.createNew('45678', null, function(err, item) {
          should.exist(err);
          err.should.equal('name is required for item creation');
          done();
      });
    });
    it('should error if number already exists', function(done) {
      Item.createNew('23456', 'nut', function(err, item) {
          should.not.exist(err);
          Item.createNew('23456', 'nut', function(err, item) {
              should.exist(err);
              err.should.equal('item with number 23456 already exists');
              done();
          });
      });
    });
  });
  describe('#findByNumber()', function() {
    it('should find a item base on number', function(done) {
      Item.createNew('12345', 'bolt', function(err, item) {
        should.not.exist(err);
        Item.findByNumber('12345', function(err, item) {
          should.not.exist(err);
          should.exist(item);
          should.exist(item.number);
          should.exist(item.name);
          item.number.should.equal('12345');
          item.name.should.equal('bolt');
          done();
        });
      });
    });
    it('should error if no item with that number', function(done) {
       Item.findByNumber('34567', function(err, Item) {
         should.exist(err);
         done();
       });
    });
  });
  describe('#findByName()', function() {
    it('should find a item base on name', function(done) {
      Item.createNew('12345', 'bolt', function(err, item) {
        should.not.exist(err);
        Item.findByName('bolt', function(err, item) {
          should.not.exist(err);
          should.exist(item);
          should.exist(item.number);
          should.exist(item.number);
          item.number.should.equal('12345');
          item.name.should.equal('bolt');
          done();
        });
      });
    });
    it('should error if no item with that name', function(done) {
       Item.findByName('washer', function(err, Item) {
         should.exist(err);
         done();
       });
    });
  });
});