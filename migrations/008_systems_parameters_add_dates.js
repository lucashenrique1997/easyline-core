const TABLE_NAME = 'system_parameters';

module.exports = {
    async up(queryInterface, Sequelize) {

        await queryInterface.addColumn(TABLE_NAME, 'created_at', {
            type: Sequelize.DATE,
        })
        await queryInterface.addColumn(TABLE_NAME, 'updated_at', {
            type: Sequelize.DATE,
        })
    },
    async down(queryInterface) {
        await queryInterface.removeColumn(TABLE_NAME, 'created_at');
        await queryInterface.removeColumn(TABLE_NAME, 'updated_at');
    },
};
