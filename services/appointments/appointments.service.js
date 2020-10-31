const sequelize = require('../mixins/sequelize.mixin');
const uuid = require('uuid').v4;
const defaultMixin = require('../mixins/default.mixin');
const tablesName = require('../../config/env.config').models.rules;
const entitiesModel = require('./appointments.definition');



module.exports = {

    name: 'appointments',

    mixins: [sequelize, defaultMixin],

    settings: [
        {
            name: tablesName.appointments,
            model: entitiesModel.appointments,
            tableName: tablesName.appointments,
        }
    ],

    mixinSetting: {},

    metadata: {},

    dependencies: [],

    actions: {
        create: {
            params: {
                entityUuid: 'string',
                needsFast: 'boolean',
                fastTime: 'string',
                date: 'string',
                $$strict: true
            },
            handler(ctx){
                const {entityUuid, needsFast, fastTime, date} = ctx.params;
                const entity = {
                    uuid: uuid(),
                    entityUuid,
                    needsFast,
                    fastTime,
                    date
                }

                this.cleanCache();

                return this[tablesName.appointments].create(entity).then((res) => {
                    return res.dataValues
                }).catch((err) => {
                    let message = 'Error while trying to create appointment';

                    return Promise.reject(message);
                });
            }
        },
        getByUuid: {
            cache: true,
            params: {
                uuid: 'string',
                $$strict: true
            },
            handler(ctx){
                const {uuid} = ctx.params;
                return this[tablesName.appointments].findOne({
                    where: {
                        uuid,
                    },
                    raw: true,
                }).then((res) => {
                    if (res) {
                        return res;
                    } else {
                        ctx.meta.$statuscode = 404;
                        return Promise.reject(new Error('Appointment Not Found'));
                    }
                }).catch((e) => {
                    let message = 'Error while trying to get appointment by uuid';
                    if (ctx.meta.$statuscode) {
                        message = e;
                    }
                    return Promise.reject(message);
                });
            }
        },
        getAll: {
            cache: true,
            handler(ctx){
                return this[tablesName.appointments].findAll({
                    raw: true,
                }).catch((e) => {
                    let message = 'Error while trying to get appointments';
                    if (ctx.meta.$statuscode) {
                        message = e;
                    }
                    return Promise.reject(message);
                });
            }
        },
        update: {
            params: {
                uuid: 'string',
                entityUuid: 'string',
                needsFast: 'boolean',
                fastTime: 'string',
                date: 'string',
                $$strict: true
            },
            handler(ctx){
                const {uuid} = ctx.params;
                this.cleanCache();
                delete ctx.params.uuid;
                return this[tablesName.appointments].update(ctx.params, {
                    where: {uuid},
                });
            }
        },
        delete: {
            params: {
                uuid: 'string',
                $$strict: true
            },
            handler(ctx) {
                const {uuid} = ctx.params;
                this.cleanCache();
                return this[tablesName.appointments].destroy({
                    where: {uuid},
                });
            },
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
