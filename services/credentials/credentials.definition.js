const Sequelize = require('sequelize');

module.exports = {
  credentials: {
    entityUuid: {
      type: Sequelize.STRING(36),
      field: 'entity_uuid',
      primaryKey: true,
      references: {
        model: 'entities',
        key: 'uuid'
      }
    },
    type: {
      type: Sequelize.ENUM,
      values: ['phone', 'e-mail', 'google', 'facebook', 'legalId'],
      field: 'type',
      primaryKey: true
    },
    user: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'user',
    },
    hash: {
      type: Sequelize.STRING,
      field: 'hash',
    },
    recovery: {
      type: Sequelize.STRING,
      field: 'recovery'
    }
  },

  fields: [
    'entity_uuid',
    'type',
    'user',
    'hash',
    'recovery'
  ],
};
