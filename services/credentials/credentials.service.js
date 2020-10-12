const credentialsModel = require('./credentials.definition');
const sequelize = require('../mixins/sequelize.mixin');
const config = require('../../config/env.config');
const tablesName = config.models.rules;
const sha256 = require('js-sha256');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(config.JWTKey);

module.exports = {
  name: 'credentials',

  dependencies: ['entities'],

  mixins: [sequelize],

  settings: [{
    name: tablesName.credentials,
    model: credentialsModel.credentials,
    tableName: tablesName.credentials,
  }],

  mixinSettings: {
    fields: credentialsModel.fields,
  },

  actions: {
    /**
     * Function creates a credential
     *
     * @param entityUuid - credential's rule name
     * @param type - can only be one of this['phone', 'e-mail', 'google', 'facebook']
     * @param user - username
     * @param password - user's password
     * @return  credentials entityUuid
     */
    create: {
      params: {
        entityUuid: 'string',
        type: {type: 'enum', values: ['phone', 'e-mail', 'google', 'facebook']},
        user: 'string',
        password: 'string'
      },
      handler(ctx) {
        return this[tablesName.credentials].create({
          entityUuid: ctx.params.entityUuid,
          user: ctx.params.user,
          type: ctx.params.type,
          hash: sha256(ctx.params.password + config.salt)
        }).then(() => {
          this.cleanCache(ctx);
          return {entityUuid: ctx.params.entityUuid};
        }).catch(() => {
          return Promise.reject('Error to create credentials');
        });
      }
    },
    /**
     * Change password by entityUuid
     *
     * @param entityUuid - credential's rule name
     * @param password - user's password
     *
     * @return  credentials entityUuid
     * **/
    updatePassword: {
      params: {
        entityUuid: 'string',
        password: 'string',
        $$strict: true
      },
      async handler(ctx) {
        try {
          const hash = sha256(ctx.params.password + config.salt);
          const recovery = cryptr.encrypt(ctx.params.password);
          return this[tablesName.credentials].update({hash, recovery}, {
            where: {
              entityUuid: ctx.params.entityUuid
            }
          }).then(async (res) => {
            if (res && res[0] > 0) {
              this.cleanCache(ctx);
              return {hash, recovery};
            } else {
              ctx.meta.$statuscode = 404;
              return Promise.reject('Credential Not Found');
            }
          })
        } catch (e) {
          let message = 'Error to update credentials';
          if (ctx.meta.$statuscode) {
            message = e;
          }
          return Promise.reject(message);
        }
      }
    },
    /**
     * Update credentials by entityUuid
     *
     * @param entityUuid - user entityUuid
     * @param user - user's nickname
     * @param type - user's type
     * @param password - user's password
     *
     * @return  credentials entityUuid
     * **/
    update: {
      params: {
        entityUuid: 'string',
        user: 'string',
        type: {type: 'enum', values: ['phone', 'e-mail', 'google', 'facebook', 'legalId']},
        password: 'string',
        $$strict: true
      },
      async handler(ctx) {
        try {
          const hash = sha256(ctx.params.password + config.salt);
          const recovery = cryptr.encrypt(ctx.params.password);
          const newCredentials = {
            user: ctx.params.user,
            type: ctx.params.type,
            hash,
            recovery
          }
          return this[tablesName.credentials].update(newCredentials, {
            where: {
              entityUuid: ctx.params.entityUuid
            }
          }).then(async (res) => {
            if (res && res[0] > 0) {
              this.cleanCache(ctx);
              return {hash, recovery};
            } else {
              ctx.meta.$statuscode = 404;
              return Promise.reject('Credential Not Found');
            }
          })
        } catch (e) {
          let message = 'Error to update credentials';
          if (ctx.meta.$statuscode) {
            message = e;
          }
          return Promise.reject(message);
        }

      }

    },
    /**
     * Function returns all credentials in the credentials table
     *
     * @return  credentials
     */
    getAll: {
      handler(ctx) {
        return this[tablesName.credentials].findAll()
          .catch((e) => {
            let message = 'Error while trying to get users';
            if (ctx.meta.$statuscode) {
              message = e;
            }
            return Promise.reject(message);
          });
      }
    },
    /**
     * Function returns a credential with given uuid
     *
     * @param entityUuid - credential's uuid
     * @return  cashback Schedule uuid
     */
    getById: {
      params: {
        entityUuid: 'string',
      },
      cache: {
        keys: ['entityUuid'],
        ttl: 3600
      },
      handler(ctx) {
        return this[tablesName.credentials].findOne({
          where: {entityUuid: ctx.params.entityUuid},
          raw: true
        }).then((res) => {
          if (res) {
            return res;
          } else {
            ctx.meta.$statuscode = 404;
            return Promise.reject('Credential Not Found');
          }
        }).catch((e) => {
          let message = 'Error while trying to get user';
          if (ctx.meta.$statuscode) {
            message = e;
          }
          return Promise.reject(message);
        });
      }
    },
    /**
     * Function returns a credential with given user
     *
     * @param user - credential's uuid
     * @return  cashback Schedule uuid
     */
    getByUser: {
      params: {
        user: 'string',
      },
      cache: {
        keys: ['user'],
        ttl: 3600
      },
      handler(ctx) {
        return this[tablesName.credentials].findOne({where: {user: ctx.params.user}, raw: true})
          .then((res) => {
            if (res) {
              return res;
            } else {
              ctx.meta.$statuscode = 404;
              return Promise.reject('User not found');
            }
          })
          .catch((e) => {
            let message = 'Error while trying to get user';
            if (ctx.meta.$statuscode) {
              message = e;
            }
            return Promise.reject(message);
          });
      }
    },

    /**
     * Crypt password
     *
     * @param password - user's password
     *
     * @return encrypted password
     * **/
    cryptPassword: {
      params: {
        password: 'string',
      },
      async handler(ctx) {
        try {
          const hash = sha256(ctx.params.password + config.salt);
          const recovery = cryptr.encrypt(ctx.params.password);

          return {hash, recovery};
        } catch (e) {
          let message = 'Error to crypto credentials';
          return Promise.reject(message);
        }
      }
    },
    decrypt: {
      params: {
        encrypted: 'string'
      },
      handler(ctx) {
        return cryptr.decrypt(ctx.params.encrypted);
      }
    },
    delete: {
      params: {
        entityUuid: 'string'
      },
      handler(ctx) {
        return this[tablesName.credentials].destroy({where: {entityUuid: ctx.params.entityUuid}});
      }
    },
  },
  events: {
    'cache.clean.credentials'() {
      if (this.broker.cacher) {
        this.broker.cacher.clean('credentials.**');
      }
    },
  },

  methods: {
    cleanCache() {
      this.broker.broadcast('cache.clean.credentials');
    },
  },
};
