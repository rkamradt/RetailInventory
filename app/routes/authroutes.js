"use strict";

module.exports = function(express, passport){
    var router = express.Router();
    router.use(function(req, res, next) {
    
        console.log(req.method, req.url);
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        
        next();	
    });
    router.post('/login', function(req, res) {
      passport.authenticate('local', function(err, user) {
        if (err) { 
          console.log('passport return error: ' + err);
          res.send(500); 
        } else if (!user) {
          console.log('user not defined ' + err);
          res.send(404);
        }
        req.logIn(user, function(err) {
          if (err) { 
            res.send(500); 
          } else {
            res.send('in login post');
          }
        });
      })(req, res);
    });
    router.get('/login', function(req, res){
        res.send("in login get");
    });
    
    router.get('/logout', function(req, res){
        res.logout();
        res.send("in logout get");
    });
    router.post('/signup', function(req, res){
        res.send("in signup post");
    });
    router.get('/signup', function(req, res){
        res.send("in signup get");
    });
    return router;
};

