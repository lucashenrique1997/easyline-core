const TABLE_NAME = 'system_parameters';

module.exports = {
    async up(queryInterface, Sequelize) {

        await queryInterface.addColumn(TABLE_NAME, 'uuid', {
            type: Sequelize.STRING(36),
        })
    },
    async down(queryInterface) {
        await queryInterface.removeColumn(TABLE_NAME, 'uuid');
    },
};
