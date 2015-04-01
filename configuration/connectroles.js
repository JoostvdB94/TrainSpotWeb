var ConnectRoles = require('connect-roles');

module.exports = function() {
	var roles = new ConnectRoles({
		failureHandler: function(req, res, action) {
			var accept = req.headers.accept || '';
			res.status(403);
			if (~accept.indexOf('html')) {
				res.json({
					message: "access-denied"
				});
			} else {
				res.send('Access Denied - You don\'t have permission to: ' + action);
			}
		}
	});


	roles.use(function(req, action) {
		if (!req.isAuthenticated()) {
			return action === 'access get locations spots';
		}
	});

	roles.use('access user', function(req) {
		if (req.user.local.username == req.params.id) {
			return true;
		};
	});

	roles.use(function(req) {
		if (req.user.hasAnyRole('admin')) {
			return true;
		};
	});

	return roles;
};