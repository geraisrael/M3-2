'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('movie_actors', [
      {
        movieId: 'mx_001',
        actorId: 'act_mx_001',
        characterName: 'Julio Zapata',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        movieId: 'mx_001',
        actorId: 'act_mx_002',
        characterName: 'Tenoch Iturbide',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        movieId: 'mx_001',
        actorId: 'act_esp_001',
        characterName: 'Luisa Cortés',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        movieId: 'mx_003',
        actorId: 'act_mx_003',
        characterName: 'Mercedes',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('movie_actors', null, {});
  }
};