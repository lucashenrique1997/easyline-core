const TABLE_NAME = 'appointments';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(TABLE_NAME, {
            uuid: {
                type: Sequelize.STRING(36),
                field: 'uuid',
                primaryKey: true
            },
            entityUuid: {
                type: Sequelize.STRING(36),
                field: 'entity_uuid',
                references: {
                    model: 'entities',
                    key: 'uuid'
                }
            },
            needsFast: {
                type: Sequelize.BOOLEAN,
                field: 'needs_fast',
            },
            fastTime: {
                type: Sequelize.INTEGER,
                field: 'fast_time',
            },
            date: {
                type: Sequelize.DATE,
                field: 'date'
            },
            createdAt: { type: Sequelize.DATE, field: 'created_at'},
            updatedAt: { type: Sequelize.DATE, field: 'updated_at'}
        });
    },

    down(queryInterface) {
        return queryInterface.dropTable(TABLE_NAME);
    },
};
