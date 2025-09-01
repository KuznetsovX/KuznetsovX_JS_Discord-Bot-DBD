'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        userId: '1001',
        username: 'BotAdmin',
        roleIds: JSON.stringify(['1234567890']),
        roles: JSON.stringify(['Admin']),
        warnings: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: '1002',
        username: 'TestUser',
        roleIds: JSON.stringify([]),
        roles: JSON.stringify(['Foreign Spy']),
        warnings: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      userId: { [Sequelize.Op.in]: ['1001', '1002'] }
    });
  }
};
