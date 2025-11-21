'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('movies', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      releaseYear: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      genre: {
        type: Sequelize.JSON,
        allowNull: false
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Duración en minutos'
      },
      directorId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'directors',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      rating: {
        type: Sequelize.DECIMAL(3, 1),
        allowNull: true,
        defaultValue: 0.0
      },
      language: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'Español'
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'México'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('movies', ['directorId']);
    await queryInterface.addIndex('movies', ['releaseYear']);
    await queryInterface.addIndex('movies', ['rating']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('movies');
  }
};