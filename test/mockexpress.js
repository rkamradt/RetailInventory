"use strict";

function createMockResponse(req, done) {
    var ret = {
        sent: "", 
        status: 0,
        _req: {},
        complete: null, 
        create: function(req, done) {
            this.sent = "";
            this.status = 0;
            this._req = req;
            this.complete = done;
        },
        header: function() {}, 
        send: function(a1) {
            if(this.complete === null) {
                throw "request.send called after request complete";
            }
            if(typeof a1 === 'number') {
                this.status = a1;
                if(a1 >= 200 && a1 < 300) {
                    this.sent = "ok";
                } else {
                    console.log("error in res " + JSON.stringify(this) + " no further information");
                    this.sent = "error";
                }
            } else {
                this.sent = a1;
                if(this.status === 0) {
                    console.log("no status, assuming 200 in req " + JSON.stringify(this));
                    this.status = 200;
                }
            }
            this.complete(this._req, this); // terminating function
            this.complete = null;
        }, 
        json: function(status, o) {
            if(this.complete === null) {
                throw "request.json called after request complete";
            }
            this.sent = JSON.stringify(o);
            this.status = status;
            if(status > 299) {
                console.log("status " + status + " being returned by res = '" + JSON.stringify(this) + "'");
            }
            this.complete(this._req, this); // terminating function
            this.complete = null;
        },
        logout: function() {},
    };
    ret.create(req, done);
    return ret;
}      

function createMockRequest(url, method, body) {
    var ret = {
        create: function(url, method, body) {
            this.url = url;
            this.method = method;
            this.params = [];
            this.body = body;
        },
        logIn: function(user, callback) {
            callback(null);
        },
        url: '', 
        method: '',
        params: [],
        body: ''
    };
    ret.create(url, method, body);
    return ret;
}

function createMockRoute() {
    var ret = {
        useFunction: {},
        getFunctions: {},
        postFunctions: {},
        putFunctions: {},
        deleteFunctions: {},
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
                Object.getOwnPropertyNames(functions).forEach(function(k, v) {
                    if(k.length > 2 && k.charAt(1) === ':') {
                        key = k;
                    }
                });
                if(key.length > 2) {
                    req.params[key.substr(2)] = path.substr(1);
                    functions[key](req, res);
                } else {
                    res.send(500);
                }
            }
        },
        doUse: function(req, res, next) {
            this.useFunction(req, res, next);   
        },
        clear: function() {
            this.useFunction = {};
            this.getFunction = {};
            this.postFunction = {};
            this.putFunction = {};
            this.deleteFunction = {};
        }
    };
    ret.clear();
    return ret;
}    
    
module.exports = {
    routes: {},
    Router: function() {
        return createMockRoute();
    },
    use: function(path, route) {
        this.routes[path] = route;
    },
    routePath: function(url, verb, body, cb) {
        var req = createMockRequest(url, verb, body);
        var res = createMockResponse(req, cb);
        var start = '/';
        var q = url.indexOf('?');
        if(q !== -1) {
            var params = url.substr(q+1);
            url = url.substr(0,q);
            var paramarray = params.split('&');
            paramarray.forEach(function(v) {
                var key, val;
                var eq = v.indexOf('=');
                if(eq != -1) {
                    key = v.substr(0,eq);
                    val = v.substr(eq+1);
                } else {
                    key = v;
                    val = "";
                }
                req.params[key] = val;
            });
        }
        var lastSlash = url.lastIndexOf('/');
        if(lastSlash >= 0) {
            if(lastSlash === 0) {
                start = url;
            } else {
                start = url.substr(0,lastSlash);
            }
        } 
        this.routes[start].exec(req, res);
    },
    clear: function() {
        Object.getOwnPropertyNames(this.routes).forEach(function(f, v) {
            if (v.clear) {
                v.clear();
            }
        });
        this.routes = {};
    },
    passport: {
        authenticate: function(realm, callback) {
            return function(req, res) {
                callback("", {});
            };
        }
    },
    
};
    
