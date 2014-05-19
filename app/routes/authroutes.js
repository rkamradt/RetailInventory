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
//   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
    router.post('/login', function(req, res, next) {
      passport.authenticate('local', function(err, user, info) {
        if (err) { 
            console.log('passport return error: ' + err);
          return next(err); 
        }
        if (!user) {
          req.flash('error', info.message);
          return res.redirect('/auth/login');
        }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.send(user);
//        res.redirect('/');
        });
      })(req, res, next);
    });
    router.get('/login', function(req, res){
        res.send("in login get");
    //res.render('login', { user: req.user, message: req.flash('error') });
    });
    
    router.get('/logout', function(req, res){
        res.logout();
        res.send("in logout get");
//        res.redirect('/');
        });
    router.post('/signup', function(req, res){
        res.send("in signup post");
//        res.redirect('/');
        });
    router.get('/signup', function(req, res){
        res.send("in signup get");
//        res.redirect('/');
        });
    return router;
};

