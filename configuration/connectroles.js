var ConnectRoles = require('connect-roles');

module.exports = function() {
	var roles = new ConnectRoles({
		failureHandler: function(req, res, action) {
			var accept = req.headers.accept || '';
			res.status(403);

			res.json({
				message: "access-denied"
			});

		}
	});


	roles.use(function(req, action) {
		if (!req.isAuthenticated()) {
			return action === 'guest';
		}
	});

	roles.use('user', function(req) {
		if (req.user.hasAnyRole('user')) {

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