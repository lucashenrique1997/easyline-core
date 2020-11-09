const Sequelize = require('sequelize');

module.exports = {
    system_parameters: {
        uuid: {
            type: Sequelize.STRING(36),
            field: 'uuid',
            allowNull: false,
            primaryKey: true
        },
        activityStartTime: {
            type: Sequelize.STRING(36),
            field: 'activity_start_time',
        },
        activityEndTime: {
            type: Sequelize.STRING(36),
            field: 'activity_end_time',
        },
        numberOfEmployees: {
            type: Sequelize.NUMBER,
            field: 'number_of_employees',
        },
        examTime: {
            type: Sequelize.NUMBER,
            field: 'exam_time',
        },
    },

    fields: [
        'uuid',
        'activityStartTime',
        'activityEndTime',
        'numberOfEmployees',
        'examTime',
    ],
};
