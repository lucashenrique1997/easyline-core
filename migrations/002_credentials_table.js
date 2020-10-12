const TABLE_NAME = 'credentials';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable(TABLE_NAME, {
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
      },
      createdAt: { type: Sequelize.DATE, field: 'created_at'},
      updatedAt: { type: Sequelize.DATE, field: 'updated_at'}
    });
  },

  down(queryInterface) {
    return queryInterface.dropTable(TABLE_NAME);
  },
};
