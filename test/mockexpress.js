"use strict";

function createMockResponse() {
    var ret = {
        create: function() {
            this.sent = "";
        },
        header: function() {}, 
        send: function(m) {this.sent = m;}, 
        sent: "", 
        logout: function() {}
    };
    ret.create();
    return ret;
}      

function createMockRequest(url, method) {
    var ret = {
        create: function(url, method) {
            this.url = url;
            this.method = method;
        },
        url: '', 
        method: ''
    };
    ret.create(url, method);
    return ret;
}

var mockRoute = {
    useFunction: {},
    getFunctions: [],
    postFunctions: [],
    putFunctions: [],
    deleteFunctions: [],
    post: function(path, route) {
        this.postFunctions[path] = route;
    },
    get: function(path, route) {
        this.getFunctions[path] = route;
    },
    put: function(path, route) {
        this.putFunctions[path] = route;
    },
    delete: function(path, route) {
        this.deleteFunctions[path] = route;
    },
    use: function(middleware) {
        this.useFunction = middleware;
    },
    exec: function(req, res, cb) {
        this.doUse(req, res, function() {});
        var path = '/';
        var url = req.url;
        var lastSlash = url.lastIndexOf('/');
        if(lastSlash >= 0) {
            if(lastSlash !== 0) {
                path = url.substr(lastSlash);
            }
        } 
        var functions;
        switch(req.method) {
        case 'POST':
            functions = this.postFunctions;
            break;
        case 'PUT':
            functions = this.putFunctions;
            break;
        case 'DELETE':
            functions = this.deleteFunctions;
            break;
        default:
        case 'GET':
            functions = this.getFunctions;
        }
        if(functions[path]) {
            functions[path](req, res);
        } else {
            var key = "";
            functions.forEach(function(v, k) {
                if(k.length > 2 && k.charAt[1] == ':') {
                    key = k;
                }
            });
            if(key.length > 2) {
                req.params[key.substr(2)] = path.substr(1);
                functions[key](req, res);
            } else {
                res.status = 500;
            }
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
        this.putFunction = [];
        this.deleteFunction = [];
    }
};    
    
module.exports = {
    routes: [],
    Router: function() { return mockRoute; },
    use: function(path, route) {
        this.routes[path] = route;
    },
    routePath: function(url, verb, cb) {
        var req = createMockRequest(url, verb);
        var res = createMockResponse();
        var start = '/';
        var lastSlash = url.lastIndexOf('/');
        if(lastSlash >= 0) {
            if(lastSlash === 0) {
                start = url;
            } else {
                start = url.substr(0,lastSlash);
            }
        } 
        this.routes[start].exec(req, res, cb);
    },
    clear: function() {
        this.routes.forEach(function(f) {
            f.clear();
        });
        this.routes = [];
    },
    passport: {
        authenticate: function(realm, callback) {
            return function(req, res, next) {
            };
        }
    },
    
};
    
