"use strict";

var User = require('../app/models/user'),
    authroutes = require('../app/routes/authroutes'),
    mongoose = require('mongoose'),
    should = require('should'),
    md5 = require('MD5');
    
        
var mockRoute = {
    useFunction: {},
    getFunctions: [],
    postFunctions: [],
    post: function(path, route) {
        this.postFunctions[path] = route;
    },
    get: function(path, route) {
        this.getFunctions[path] = route;
    },
    use: function(middleware) {
        this.useFunction = middleware;
    },
    exec: function(req, res, cb) {
        this.doUse(req, res, function() {});
        var path = req.url;
        var lastSlash = req.url.lastIndexOf('/');
        if(lastSlash > 0) {
            path = path.substr(lastSlash);
        } 
        switch(req.method) {
        case 'POST':
            this.postFunctions[path](req, res);
            break;
        default:
        case 'GET':
            this.getFunctions[path](req, res);
        }
        cb(req,res);
    },
    doUse: function(req, res, next) {
        this.useFunction(req, res, next);   
    },
    clear: function() {
        this.useFunction = {};
        this.getFunction = [];
        this.postFunction = [];
    },
};    
    
var stubExpress = {
    routes: [],
    Router: function() { return mockRoute; },
    use: function(path, route) {
        return this.routes[path] = route;
    },
    routePath: function(req, res, cb) {
        var start = '/';
        var lastSlash = req.url.lastIndexOf('/');
        if(lastSlash > 0) {
            start = req.url.substr(0,lastSlash);
        } 
        this.routes[start].exec(req, res, cb);
    },
    clear: function() {
        this.routes.forEach(function(f) {
            r.clear();
        });
        this.routes = [];
    }
};

var stubPassport = {
    authenticate: function(realm, callback) {
        return function(req, res, next) {
        }
    }
};    
    
    
var Route = {}

describe('AuthRoutes', function(){
    beforeEach(function(done) {
        Route = stubExpress.use('/auth',authroutes(stubExpress,stubPassport));
        done();
    });
    afterEach(function(done) {
        stubExpress.clear();
        done();
    });
    describe("#post-login", function () {
        it("should authenticate when the POST /auth/login  is called", function(done) {
            var req = {url: '/auth/login', method: 'POST'};
            var res = {header: function() {}, send: function(m) {this.sent = m}, sent: " ", logout: function() {}};
            stubExpress.routePath(req, res, function(req, res) {
                res.sent.should.equal(' ');
                done();
            });
        });
    });
    describe("#get-login", function () {
        it("should display the login page when the GET /auth/login  is called", function(done) {
            var req = {url: '/auth/login', method: 'GET'};
            var res = {header: function() {}, send: function(m) {this.sent = m}, sent: " ", logout: function() {}};
            stubExpress.routePath(req, res, function(req, res) {
                res.sent.should.equal('in login get');
                done();
            });
        });
    });
    describe("#post-signup", function () {
        it("should add a new user when the POST /auth/signup  is called", function(done) {
            var req = {url: '/auth/signup', method: 'POST'};
            var res = {header: function() {}, send: function(m) {this.sent = m}, sent: " ", logout: function() {}};
            stubExpress.routePath(req, res, function(req, res) {
                res.sent.should.equal('in signup post');
                done();
            });
        });
    });
    describe("#get-signup", function () {
        it("should display the signup page when the GET /auth/signup  is called", function(done) {
            var req = {url: '/auth/signup', method: 'GET'};
            var res = {header: function() {}, send: function(m) {this.sent = m}, sent: " ", logout: function() {}};
            stubExpress.routePath(req, res, function(req, res) {
                res.sent.should.equal('in signup get');
                done();
            });
        });
    });
    describe("#get-logout", function () {
        it("should display the home page when the GET /auth/logout  is called", function(done) {
            var req = {url: '/auth/logout', method: 'GET'};
            var res = {header: function() {}, send: function(m) {this.sent = m}, sent: " ", logout: function() {}};
            stubExpress.routePath(req, res, function(req, res) {
                res.sent.should.equal('in logout get');
                done();
            });
        });
    });
});