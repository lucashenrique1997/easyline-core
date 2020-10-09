const jwt = require('jsonwebtoken');
const config = require('../config/env.config');
const log = require('./mixins/log.mixin');

module.exports = {
	name: 'jwt',
	mixins: [log],
	actions: {
		generateToken(ctx) {
			const user = Object.assign({}, ctx.params);
			return jwt.sign(user, config.secret);
		},
		verifyToken: {
			params: {
				token: 'string',
			},
			handler(ctx) {
				return new Promise((resolve, reject) => {
					jwt.verify(ctx.params.token, config.secret, (err, decoded) => {
						if (err) {
							reject(err);
						} else {
							delete decoded.iat;
							delete decoded.exp;
							resolve(decoded);
						}
					});
				});
			},
		},
	},
};
