'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('movies', [
      {
        id: 'mx_001',
        title: 'Y tu mamá también',
        releaseYear: 2001,
        genre: JSON.stringify(['Drama', 'Road Movie', 'Coming of Age']),
        duration: 105,
        directorId: 'dir_mx_001',
        rating: 7.7,
        language: 'Español',
        country: 'México',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'mx_002',
        title: 'Roma',
        releaseYear: 2018,
        genre: JSON.stringify(['Drama', 'Histórico']),
        duration: 135,
        directorId: 'dir_mx_001',
        rating: 8.0,
        language: 'Español',
        country: 'México',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'mx_003',
        title: 'El laberinto del fauno',
        releaseYear: 2006,
        genre: JSON.stringify(['Fantasía', 'Drama', 'Guerra']),
        duration: 118,
        directorId: 'dir_mx_002',
        rating: 8.2,
        language: 'Español',
        country: 'México',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'mx_004',
        title: 'Birdman',
        releaseYear: 2014,
        genre: JSON.stringify(['Drama', 'Comedia negra']),
        duration: 119,
        directorId: 'dir_mx_003',
        rating: 7.7,
        language: 'Inglés',
        country: 'Estados Unidos',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('movies', null, {});
  }
};