'use strict';
module.exports = (sequelize, DataTypes) => {
  var QuestionAttr = sequelize.define('QuestionAttr', {
    options: DataTypes.STRING,
    correct: DataTypes.STRING,
    answer: DataTypes.STRING,
    col1: DataTypes.STRING,
    col2: DataTypes.STRING,
    matchAnswer: DataTypes.JSON,
    images: DataTypes.STRING
  });

  QuestionAttr.associate = (models) => {
        QuestionAttr.belongsTo(models.Question, {
            foreignKey: 'question_id',
            onDelete: 'CASCADE',
        });
    }
  return QuestionAttr;
};