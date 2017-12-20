'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('QuestionAttrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      options: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      questionId: {
        type: Sequelize.INTEGER
      },
      correct: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      answer: {
        type: Sequelize.STRING
      },
      col1: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      col2: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      matchAnswer: {
        type: Sequelize.JSON
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('QuestionAttrs');
  }
};