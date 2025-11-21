'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('directors', [
      {
        id: 'dir_mx_001',
        name: 'Alfonso Cuarón',
        nationality: 'Mexicano',
        birthYear: 1961,
        birthPlace: 'Ciudad de México',
        notableAwards: JSON.stringify(['2 Óscares', '3 Premios BAFTA', 'Globo de Oro']),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'dir_mx_002',
        name: 'Guillermo del Toro',
        nationality: 'Mexicano',
        birthYear: 1964,
        birthPlace: 'Guadalajara, Jalisco',
        notableAwards: JSON.stringify(['2 Óscares', 'Globo de Oro', 'BAFTA']),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'dir_mx_003',
        name: 'Alejandro González Iñárritu',
        nationality: 'Mexicano',
        birthYear: 1963,
        birthPlace: 'Ciudad de México',
        notableAwards: JSON.stringify(['4 Óscares', '3 Globos de Oro', '2 BAFTA']),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('directors', null, {});
  }
};