const ApiGateway = require('moleculer-web');
const moleculerConfig = require('../moleculer.config');

const statusErrors = {
	400: 'BAD_REQUEST',
	401: 'UNAUTHORIZED',
	403: 'FORBIDDEN',
	404: 'NOT_FOUND',
	500: 'UNKNOWN_ERROR',
};

module.exports = {
	mixins: [ApiGateway],

	settings: {
		port: 3000,
		cors: {
			origin: '*',
			methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE'],
			allowedHeaders: [
				'X-Requested-With',
				'Authorization',
				'Content-Type',
				'invitation-token',
			],
		},
		routes: [
			{
				path: '/entities',
				onError(req, res, error) {
					this.parseError(res, error);
				},
				authorization: false,
				aliases: {
					'POST /': 'entities.create',
					'GET /': 'entities.getAll',
					'GET /:uuid': 'entities.getByUuid',
					'PATCH /:uuid': 'entities.update',
					'DELETE /:uuid': 'entities.delete',
				},
				bodyParsers: {
					json: true,
				},
			},
			{
				path: '/appointments',
				onError(req, res, error) {
					this.parseError(res, error);
				},
				authorization: false,
				aliases: {
					'POST /': 'appointments.create',
					'GET /': 'appointments.getAll',
					'GET /:uuid': 'appointments.getByUuid',
					'PATCH /:uuid': 'appointments.update',
					'DELETE /:uuid': 'appointments.delete',
				},
				bodyParsers: {
					json: true,
				},
			},
			{
				path: '/system-parameters',
				onError(req, res, error) {
					this.parseError(res, error);
				},
				authorization: false,
				aliases: {
					'GET /': 'systemParameters.get',
					'PATCH /': 'systemParameters.update',
				},
				bodyParsers: {
					json: true,
				},
			},
			{
				path: '/',
				authorization: false,
				aliases: {
					'health-check': (req, res) => {
						const end = new Date() - moleculerConfig.startDate;
						if (end > 3600 * 1000) {
							res.writeHead(410);
							return res.end('Restart');
						}
						res.end('ok ' + end);
					},
				},
			},
		],
	},
	methods: {
		authorize(ctx, route, req, res) {
			const auth = req.headers['authorization'];
			if (auth && auth.startsWith('Bearer')) {
				const token = auth.slice(7);
				return ctx.call('jwt.verifyToken', {token})
					.catch((error) => {
						res.statusCode = 403;
						res.end(JSON.stringify({
							code: 403,
							error: {message: error.message},
						}));
						return Promise.reject(error);
					});
			} else {
				res.statusCode = 401;
				res.end(JSON.stringify({
					code: 401,
					error: 'Invalid authorization token',
				}));
				return Promise.reject(new Error());
			}
		},
		parseError(res, error) {
			let errorModel;
			if (error.type === 'VALIDATION_ERROR') {
				errorModel = {
					message: error.data[0].message,
					statusCode: 400,
				};
				error.ctx.meta.status = error.type;
			} else {
				errorModel = {
					message: error.message,
					statusCode: error.ctx && error.ctx.meta && error.ctx.meta.$statuscode ?
						error.ctx.meta.$statuscode : 500,
				};
			}
			errorModel.status = error.ctx && error.ctx.meta && error.ctx.meta.status ?
				error.ctx.meta.status : statusErrors[errorModel.statusCode];
			res.writeHead(errorModel.statusCode);
			res.end(JSON.stringify(errorModel));
		},
	},
};
