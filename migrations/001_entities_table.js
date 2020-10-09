const TABLE_NAME = 'entities';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(TABLE_NAME, {
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
      },
      createdAt: { type: Sequelize.DATE, field: 'created_at'},
      updatedAt: { type: Sequelize.DATE, field: 'updated_at'}
    });
  },

  down(queryInterface) {
    return queryInterface.dropTable(TABLE_NAME);
  },
};
