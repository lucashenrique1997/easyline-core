const Sequelize = require('sequelize');

module.exports = {
    appointments: {
        uuid: {
            type: Sequelize.STRING(36),
            field: 'uuid',
            allowNull: false,
            primaryKey: true
        },
        entityUuid: {
            type: Sequelize.STRING(36),
            field: 'entity_uuid',
            allowNull: false,
            references: {
                model: 'entities',
                key: 'uuid'
            }
        },
        needsFast: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            field: 'needs_fast',
        },
        fastTime: {
            type: Sequelize.NUMBER,
            allowNull: false,
            field: 'fast_time',
        },
        priority: {
            type: Sequelize.NUMBER,
            allowNull: false,
            field: 'priority',
        },
        status: {
            type: Sequelize.ENUM,
            values: ['scheduled', 'canceled', 'confirmed'],
            field: 'status',
        },
        date: {
            type: Sequelize.DATE,
            allowNull: false,
            field: 'date'
        },
        createdAt: {
            type: Sequelize.DATE,
            field: 'created_at'
        },
        updatedAt: {
            type: Sequelize.DATE,
            field: 'updated_at'
        }
    },

    fields: [
        'uuid',
        'entityUuid',
        'needsFast',
        'fastTime',
        'date',
    ],
};
