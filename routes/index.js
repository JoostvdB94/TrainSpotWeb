module.exports = function(router, passport) {

    router.get('/', function(req, res, next) {
        res.render('index');
    });

    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/signup',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    router.get('/login', function(req, res, next) {
        res.json({
            authenticated: req.isAuthenticated(),
            user: req.user
        });
    });

    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/login',
        failureRedirect: '/login',
        failureFlash: true
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

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}