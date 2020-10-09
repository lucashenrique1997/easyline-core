const Sequelize = require('sequelize');

module.exports = {
  entities: {
    uuid: {
      type: Sequelize.STRING(36),
      field: 'uuid',
      primaryKey: true
    },
    type: {
      type: Sequelize.ENUM,
      values: ['user', 'admin'],
      allowNull: false,
      field: 'type',
    },
    status: {
      type: Sequelize.ENUM,
      values: ['active', 'inactive'],
      allowNull: false,
      field: 'status',
    }
  },

  fields: [
    'uuid',
    'type',
    'status',
  ],
};
