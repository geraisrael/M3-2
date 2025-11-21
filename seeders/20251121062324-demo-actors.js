'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('actors', [
      {
        id: 'act_mx_001',
        name: 'Gael García Bernal',
        nationality: 'Mexicano',
        birthYear: 1978,
        birthPlace: 'Guadalajara, Jalisco',
        notableAwards: JSON.stringify(['Premio del Festival de Cannes', '2 Premios BAFTA']),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'act_mx_002',
        name: 'Diego Luna',
        nationality: 'Mexicano',
        birthYear: 1979,
        birthPlace: 'Toluca, Estado de México',
        notableAwards: JSON.stringify(['Premio Marcello Mastroianni', 'Diosa de Plata']),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'act_mx_003',
        name: 'Salma Hayek',
        nationality: 'Mexicana',
        birthYear: 1966,
        birthPlace: 'Coatzacoalcos, Veracruz',
        notableAwards: JSON.stringify(['Nominación al Oscar', 'Emmy']),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'act_esp_001',
        name: 'Maribel Verdú',
        nationality: 'Española',
        birthYear: 1970,
        birthPlace: 'Madrid, España',
        notableAwards: JSON.stringify(['Goya a Mejor Actriz']),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('actors', null, {});
  }
};