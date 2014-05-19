"use strict";

var User = require('../app/models/user'),
    mongoose = require('mongoose'),
    should = require('should'),
    md5 = require('MD5');

var db;

describe('User', function(){
  before(function(done){
    mongoose.connect('mongodb://localhost/RetailInventoryTest');
    db = mongoose.connection.on('open', done);
  });
  after(function(done) {
      db.close(done);
  });
  beforeEach(function(done) {
      User = db.model('User');
      User.remove({},done);
  });
  describe('#createNew()', function() {
    it('should save without error if specified correctly', function(done) {
      User.createNew('someone@email.com', 'password', function(err, user) {
          should.not.exist(err);
          should.exist(user);
          should.exist(user.email);
          should.exist(user.password);
          user.email.should.equal('someone@email.com');
          user.password.should.equal(md5('password'));
          done();
      });
    });
    it('should error if no email is present', function(done) {
      User.createNew(null, 'password', function(err, user) {
          should.exist(err);
          err.should.equal('email is required for user creation');
          done();
      });
    });
    it('should error if no password is present', function(done) {
      User.createNew('badperson@email.com', null, function(err, user) {
          should.exist(err);
          err.should.equal('password is required for user creation');
          done();
      });
    });
    it('should error if password is too short', function(done) {
      User.createNew('badperson@email.com', "pw", function(err, user) {
          should.exist(err);
          err.should.equal('password must be more than 7 characters long');
          done();
      });
    });
    it('should error if email already exists', function(done) {
      User.createNew('test@email.com', 'password', function(err, user) {
          should.not.exist(err);
          User.createNew('test@email.com', 'password1', function(err, user) {
              should.exist(err);
              err.should.equal('user with email test@email.com already exists');
              done();
          });
      });
    });
  });
  describe('#findByEmail()', function() {
    it('should find a user base on email', function(done) {
      User.createNew('someone@email.com', 'password', function(err, user) {
        should.not.exist(err);
        User.findByEmail('someone@email.com', function(err, user) {
          should.not.exist(err);
          should.exist(user);
          should.exist(user.email);
          should.exist(user.password);
          user.email.should.equal('someone@email.com');
          user.password.should.equal(md5('password'));
          done();
        });
      });
    });
    it('should error if no user with that email', function(done) {
       User.findByEmail('test1@email.com', function(err, user) {
         should.exist(err);
         done();
       });
    });
  });
  describe('#verify', function() {
    it('should pass if email and password match', function(done) {
      User.createNew('someone@email.com', 'password', function(err, user) {
        should.not.exist(err);
        User.verify('someone@email.com', 'password', function(err, user) {
          should.not.exist(err);
          done();
        });
      });
    });
    it('should error email and password dont match', function(done) {
      User.createNew('someone@email.com', 'password', function(err, user) {
        should.not.exist(err);
        User.verify('someone@email.com', 'password1', function(err, user) {
          should.exist(err);
          done();
        });
      });
    });
  });
});