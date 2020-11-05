const TABLE_NAME = 'appointments';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn(TABLE_NAME, 'status', {
            type: Sequelize.ENUM,
            values: ['scheduled', 'canceled', 'confirmed'],
        })

        await queryInterface.addColumn(TABLE_NAME, 'priority', {
            type: Sequelize.INTEGER,
        })
    },
    async down(queryInterface) {
        await queryInterface.removeColumn(TABLE_NAME, 'status');
        await queryInterface.removeColumn(TABLE_NAME, 'priority');
    },
};
