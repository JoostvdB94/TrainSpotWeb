module.exports = function(router, passport) {

    router.get('/', function(req, res, next) {
        res.render('index');
    });

    router.post('/signup', passport.authenticate('local-signup'), function(req, res) {
        res.json({
            authenticated: true,
            user: req.user
        })
    });

    router.get('/login', function(req, res, next) {
        res.json({
            authenticated: req.isAuthenticated(),
            user: req.user
        });
    });

    router.post('/login', passport.authenticate('local-login'), function(req, res) {
        res.json({
            authenticated: true,
            user: req.user
        })
    });

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