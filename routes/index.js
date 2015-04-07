module.exports = function(router, passport) {

    router.get('/', function(req, res, next) {
        res.render('index');
    });

    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/login',
        failureRedirect: '/login'
    }));

    router.get('/login', function(req, res, next) {
        res.json({
            authenticated: req.isAuthenticated(),
            user: req.user
        });
    });

    router.get('/inloggen', function(req, res, next) {
        res.render('login');
    });

    router.get('/home', function(req, res, next) {
        res.render('home');
    });

    router.get('/registreren', function(req, res, next) {
        res.render('signup');
    });

    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/login',
        failureRedirect: '/login'
    }));

    router.get('/signup', function(req, res, next) {
        res.json({
            authenticated: req.isAuthenticated()
        });
    });

    router.get('/logout', function(req, res, next) {
        req.logout();
        res.json({
            authenticated: false
        });
    });
    return router;
};