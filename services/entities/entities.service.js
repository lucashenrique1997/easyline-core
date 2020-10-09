const sequelize = require('../mixins/sequelize.mixin');
const uuid = require('uuid').v4;
const defaultMixin = require('../mixins/default.mixin');
const tablesName = require('../../config/env.config').models.rules;
const entitiesModel = require('./entities.definition.js');



module.exports = {

  name: 'entities',

  mixins: [sequelize, defaultMixin],

  settings: [
    {
      name: tablesName.entities,
      model: entitiesModel.entities,
      tableName: tablesName.entities,
    }
  ],

  mixinSetting: {},

  metadata: {},

  dependencies: [],

  actions: {
    create: {
      params: {
        type: 'string',
        status: 'string',
        $$strict: true
      },
      handler(ctx){
        const {type, status} = ctx.params;
        const entity = {
          uuid: uuid(),
          type,
          status
        }

        this.cleanCache();

        return this[tablesName.entities].create(entity).then((res) => {
          return res.dataValues
        }).catch((err) => {
          let message = 'Error while trying to create user';

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
        return this[tablesName.entities].findOne({
          where: {
            uuid,
          },
          raw: true,
        }).then((res) => {
          if (res) {
            return res;
          } else {
            ctx.meta.$statuscode = 404;
            return Promise.reject(new Error('User Not Found'));
          }
        }).catch((e) => {
          let message = 'Error while trying to get user by uuid';
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
        return this[tablesName.entities].findAll({
          raw: true,
        }).catch((e) => {
          let message = 'Error while trying to get users';
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
        type: 'string',
        status: 'string',
        $$strict: true
      },
      handler(ctx){
        const {uuid} = ctx.params;
        this.cleanCache();
        delete ctx.params.uuid;
        return this[tablesName.entities].update(ctx.params, {
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
        return this[tablesName.entities].destroy({
          where: {uuid},
        });
      },
    },
  },

  events: {
    'cache.clean.entities'() {
      if (this.broker.cacher) {
        this.broker.cacher.clean('entities.**');
      }
    },
  },

  methods: {
    cleanCache() {
      this.broker.broadcast('cache.clean.entities');
    },
  },
}
