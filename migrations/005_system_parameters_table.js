const TABLE_NAME = 'system_parameters';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(TABLE_NAME, {
            activityStartTime: {
                type: Sequelize.STRING(36),
                field: 'activity_start_time',
            },
            activityEndTime: {
                type: Sequelize.STRING(36),
                field: 'activity_end_time',
            },
            numberOfEmployees: {
                type: Sequelize.INTEGER,
                field: 'number_of_employees',
            },
            examTime: {
                type: Sequelize.INTEGER,
                field: 'exam_time',
            },
        });
    },

    down(queryInterface) {
        return queryInterface.dropTable(TABLE_NAME);
    },
};
