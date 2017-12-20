'use strict';
module.exports = (sequelize, DataTypes) => {
  var QuestionAttr = sequelize.define('QuestionAttr', {
    options: DataTypes.ARRAY(DataTypes.STRING),
    correct: DataTypes.ARRAY(DataTypes.STRING),
    questionId: DataTypes.INTEGER,
    answer: DataTypes.STRING,
    col1: DataTypes.ARRAY(DataTypes.STRING),
    col2: DataTypes.ARRAY(DataTypes.STRING),
    matchAnswer: DataTypes.JSON,
    images: DataTypes.ARRAY(DataTypes.STRING)
  });

  QuestionAttr.associate = (models) => {
        QuestionAttr.belongsTo(models.Question, {
            foreignKey: 'questionId',
            onDelete: 'CASCADE',
        });
    }
  return QuestionAttr;
};