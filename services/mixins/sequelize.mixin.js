const config = require('../../config/env.config');
const databaseConfig = require('../../config/db')[config.environment];
const tablesName = require('../../config/env.config').models.rules;
const Sequelize = require('sequelize');
let sequelize;
const models = {};
const validator = require('jsonschema').validate;

const settingsSchema = {
	type: 'array',
	items: {
		type: 'object',
		properties: {
			name: {
				type: 'string',
				required: true,
			},
			model: {
				type: 'object',
				required: true,
			},
			tableName: {
				type: 'string',
				required: true,
			},
		},
	},
};

module.exports = {
	name: 'sequelize',
	methods: {
		connectDatabase(database = '') {
			console.log(database);
			const databaseDatabase = database ? databaseConfig[database].database : databaseConfig.database;
			const databaseSchema = database ? databaseConfig[database].schema : databaseConfig.schema;
			return new Sequelize(databaseDatabase, databaseConfig.username, databaseConfig.password, {
				host: databaseConfig.host,
				socketPath: databaseConfig.socketPath,
				dialect: databaseConfig.dialect,
				operatorsAliases: false,
				schema: databaseSchema,
				pool: {
					max: 5,
					min: 0,
					acquire: 30000,
					idle: 10000,
				},
				dialectOptions: {
					host: databaseConfig.host,
					socketPath: databaseConfig.socketPath,
					supportBigNumbers: true,
					bigNumberStrings: true,
					ssl: false,
				},
				define: {
					underscored: false,
					createdAt: database ? false : 'created_at',
					updatedAt: database ? false : 'updated_at',
				},
			});
		},
	},
	started() {
		const result = validator(this.settings, settingsSchema);
		if (!result.valid) {
			throw new Error('ValidationError: ' + result.errors.join(', ')
				.replace('instance', 'settings') + ' at ' + this.name);
		} else {
			if (!sequelize) {
				sequelize = this.connectDatabase();
			}
			if (!this.sequelize) {
				this.sequelize=sequelize;
			}

			for (const setting of this.settings) {
				if (models[setting.name]) {
					throw new Error('Model ' + setting.name + ' is already defined in another service');
				}

				if (setting.database) {
					const thisSequelize = this.connectDatabase(setting.database);
					this[setting.name] = thisSequelize.define(
						setting.name,
						setting.model,
						{tableName: setting.tableName});
					models[setting.name] = this[setting.name];
				} else {
					this[setting.name] = sequelize.define(setting.name, setting.model, {tableName: setting.tableName});
					models[setting.name] = this[setting.name];

					if (models[tablesName.entities]){

						if (models[tablesName.profiles] &&  setting.name === tablesName.profiles) {
							models[tablesName.profiles].hasOne(models[tablesName.entities], {
								sourceKey: 'entityUuid',
								foreignKey: 'uuid',
								as: ''
							});
							models[tablesName.entities].belongsTo(models[tablesName.profiles], {
								targetKey: 'entityUuid',
								foreignKey: 'uuid'
							});
						}

						if (models[tablesName.credentials] &&  setting.name === tablesName.credentials) {
							models[tablesName.credentials].hasOne(models[tablesName.entities], {
								sourceKey: 'entityUuid',
								foreignKey: 'uuid',
								as: 'entityCredentials'
							});
							models[tablesName.entities].belongsTo(models[tablesName.credentials], {
								targetKey: 'entityUuid',
								foreignKey: 'uuid',
								as: 'credentialsEntities'
							});
						}
					}

				}
				this.allModels = models;
			}
		}
	},
	stopped() {
		for (const setting of this.settings) {
			if (models[setting.name]) {
				models[setting.name] = null;
			}
		}
	},
};



