const LogMixin = require('./log.mixin');

module.exports = {
	name: 'defaultMixin',
	mixins: [LogMixin],
	logSettings: {
		logLevel: 'info',
	},
	hooks: {
		before: {
			'*': ['startLogging', 'validateFields'],
		},
	},
	methods: {
		validateFields(context) {
			context.meta.query = {};
			const action = context.action.rawName;
			const params = context.params;
			if (action.startsWith('get') && params.fields) {
				const allowedFields = this.schema.mixinSettings.fields;
				const fields = params.fields.split(',');
				const unallowedFields = [];
				for (const field of fields) {
					const isAllowed = allowedFields.includes(field);
					if (!isAllowed) {
						unallowedFields.push(field);
					}
				}
				if (unallowedFields.length > 0) {
					return Promise.reject(new Error(JSON.stringify({unallowedFields})));
				}
				context.meta.query = {
					attributes: [...fields],
				};
			}
		},
	},
};
