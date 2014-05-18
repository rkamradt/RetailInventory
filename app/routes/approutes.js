"use strict";

module.exports = function(express, ensureAuthenticated) {
    var router = express.Router();
    router.use(function(req, res, next) {
    
        console.log(req.method, req.url);
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        
        next();	
    });
    router.get('/', function(req, res){
        res.send("I'm in the home page");
    });
    router.get('/account', function(req, res){
        res.send("I'm in the accout page");
    });
    return router;
};
    
