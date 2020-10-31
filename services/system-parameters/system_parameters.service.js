const sequelize = require('../mixins/sequelize.mixin');
const defaultMixin = require('../mixins/default.mixin');
const tablesName = require('../../config/env.config').models.rules;
const entitiesModel = require('./system_parameters.definition');



module.exports = {

    name: 'systemParameters',

    mixins: [sequelize, defaultMixin],

    settings: [
        {
            name: tablesName.system_parameters,
            model: entitiesModel.system_parameters,
            tableName: tablesName.system_parameters,
        }
    ],

    mixinSetting: {},

    metadata: {},

    dependencies: [],

    actions: {
        get: {
            cache: true,
            handler(ctx){
                return this[tablesName.system_parameters].findOne({
                    raw: true,
                }).then((res) => {
                    if (res) {
                        return res;
                    } else {
                        ctx.meta.$statuscode = 404;
                        return Promise.reject(new Error('System parameters Not Found'));
                    }
                }).catch((e) => {
                    let message = 'Error while trying to get System parameters';
                    if (ctx.meta.$statuscode) {
                        message = e;
                    }
                    return Promise.reject(message);
                });
            }
        },
        update: {
            params: {
                activityStartTime: 'string',
                activityEndTime: 'string',
                numberOfEmployees: 'number',
                examTime: 'number',
                $$strict: true
            },
            handler(ctx){
                this.cleanCache();
                delete ctx.params.uuid;
                return this[tablesName.appointments].update(ctx.params);
            }
        },
    },

    events: {
        'cache.clean.appointments'() {
            if (this.broker.cacher) {
                this.broker.cacher.clean('appointments.**');
            }
        },
    },

    methods: {
        cleanCache() {
            this.broker.broadcast('cache.clean.appointments');
        },
    },
}
