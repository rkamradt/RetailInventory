/*global describe, it, before, beforeEach, after, afterEach */
"use strict";

var User = require('../app/models/user'),
    authroutes = require('../app/routes/authroutes'),
    mongoose = require('mongoose'),
    should = require('should'),
    express = require('./mockexpress'),
    md5 = require('MD5');        
    
var Route = {};

describe('AuthRoutes', function(){
    beforeEach(function(done) {
        Route = express.use('/auth',authroutes(express,express.passport));
        done();
    });
    afterEach(function(done) {
        express.clear();
        done();
    });
    describe("#post-login", function () {
        it("should authenticate when the POST /auth/login  is called", function(done) {
            express.routePath('/auth/login', 'POST', function(req, res) {
                res.sent.should.equal(' ');
                done();
            });
        });
    });
    describe("#get-login", function () {
        it("should display the login page when the GET /auth/login  is called", function(done) {
            express.routePath('/auth/login', 'GET', function(req, res) {
                res.sent.should.equal('in login get');
                done();
            });
        });
    });
    describe("#post-signup", function () {
        it("should add a new user when the POST /auth/signup  is called", function(done) {
            express.routePath('/auth/signup', 'POST', function(req, res) {
                res.sent.should.equal('in signup post');
                done();
            });
        });
    });
    describe("#get-signup", function () {
        it("should display the signup page when the GET /auth/signup  is called", function(done) {
            express.routePath('/auth/signup', 'GET', function(req, res) {
                res.sent.should.equal('in signup get');
                done();
            });
        });
    });
    describe("#get-logout", function () {
        it("should display the home page when the GET /auth/logout  is called", function(done) {
            express.routePath('/auth/logout', 'GET', function(req, res) {
                res.sent.should.equal('in logout get');
                done();
            });
        });
    });
});