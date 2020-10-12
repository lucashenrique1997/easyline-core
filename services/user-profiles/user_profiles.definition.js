const Sequelize = require('sequelize');

module.exports = {
  user_profiles: {
    entityUuid: {
      type: Sequelize.STRING(36),
      field: 'entity_uuid',
      primaryKey: true,
      references: {
        model: 'Entities',
        key: 'uuid'
      }
    },
    name: {
      type: Sequelize.STRING(255),
      field: 'name',
    },
    birthDate: {
      type: Sequelize.DATE,
      field: 'birth_date'
    },
    legalId: {
      type: Sequelize.STRING(14),
      field: 'legal_id',
    },
    gender: {
      type: Sequelize.ENUM,
      values: ['female', 'male'],
      field: 'gender',
    },
    isPregnant: {
      type: Sequelize.BOOLEAN,
      field: 'is_pregnant',
    },
    specialNeeds: {
      type: Sequelize.BOOLEAN,
      field: 'special_needs',
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
    'entity_uuid',
    'name',
    'birthDate',
    'legalId',
    'gender',
    'isPregnant',
    'specialNeeds',
  ],
};
