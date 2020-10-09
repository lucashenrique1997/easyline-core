module.exports = {
	name: 'log',
	logSettings: {
		logLevel: 'info',
	},
	hooks: {
		before: {
			'*': ['startLogging'],
		},
	},
	methods: {
		startLogging(context) {
			this.logger.info({
				messageType: 'BROKER_CALL',
				contextId: context.id,
				requestId: context.requestID,
				parentId: context.parentID,
				requestLevel: context.level,
				hook: 'before',
				action: context.action.rawName,
				service: context.service.name,
			}, 'Broker Call');
		},
	},

	created() {
		if (this.settings.logLevel) {

		}
	},
};
