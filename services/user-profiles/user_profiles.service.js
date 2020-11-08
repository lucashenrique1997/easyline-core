const profilesModel = require('./user_profiles.definition');
const sequelize = require('../mixins/sequelize.mixin');
const config = require('../../config/env.config');
const tablesName = config.models.rules
const uuid = require('uuid').v4;

module.exports = {
  name: 'profiles',

  mixins: [sequelize],

  dependencies: ['entities'],

  settings: [{
    name: tablesName.user_profiles,
    model: profilesModel.user_profiles,
    tableName: tablesName.user_profiles,
  }],

  mixinSettings: {
    fields: profilesModel.fields,
  },

  actions: {
    create: {
      params: {
        entityUuid: 'string',
        name: 'string',
        legalId: 'string',
        birthDate: 'string',
        gender: 'string',
        isPregnant: 'boolean',
        specialNeeds: 'boolean',
        $$strict: true
      },
      async handler(ctx) {
        const {name, legalId, birthDate, gender, isPregnant, specialNeeds, entityUuid} = ctx.params;
        const user_profile = {
          entityUuid,
          name,
          legalId,
          birthDate,
          gender,
          isPregnant,
          specialNeeds
        }
        this.cleanCache();
        return this[tablesName.user_profiles].create(user_profile).then((res) => {
          return res.dataValues
        }).catch((err) => {
          console.log(err);
          let message = 'Error while trying to create user profile';
          return Promise.reject(message);
        });

      }
    },
    getById: {
      params: {
        entityUuid: 'string',
      },
      cache: {
        keys: ['entityUuid']
      },
      handler(ctx) {
        return this[tablesName.user_profiles].findOne({where: {entityUuid: ctx.params.entityUuid}, raw: true});
      }
    },
    getByToken: {
      async handler(ctx) {
        const {meta: {authorizationToken}} = ctx;
        const token = await ctx.call('jwt.verifyToken', {token: authorizationToken});
        return this[tablesName.user_profiles].findOne({where: {entityUuid: token.entityUuid}, raw: true});
      }
    },
    getByLegalId: {
      params: {
        legalId: 'string',
      },
      handler(ctx) {
        return this[tablesName.user_profiles].findOne({where: {legalId: ctx.params.legalId}, raw: true});
      }
    },
    update: {
      params: {
        entityUuid: 'string',
        name: {type: 'string', optional: true},
        legalId: {type: 'string', optional: true},
        birthDate: {type: 'string', optional: true},
        gender: {type: 'string', optional: true},
        isPregnant: {type: 'boolean', optional: true},
        specialNeeds: {type: 'boolean', optional: true},
        $$strict: true
      },
      async handler(ctx) {
        try {
          const profile = await this[tablesName.user_profiles].findOne({where: {entityUuid: ctx.params.entityUuid}});
          const entityUuid = ctx.params.entityUuid;

          if (!profile) {
            ctx.meta.$statuscode = 404;
            return Promise.reject('Profile Not Found');
          }
          delete ctx.params.entityUuid;
          await profile.update(ctx.params);
          this.cleanCache(ctx, entityUuid, profile.email);
        } catch (e) {
          let message = 'Error to update profiles';
          if (ctx.meta.$statuscode) {
            message = e;
          }
          return Promise.reject(message);
        }
      }
    },
  },
  methods: {
    cleanCache() {

    }
  }
};
