'use strict';
module.exports = (sequelize, DataTypes) => {
  var Question = sequelize.define('Question', {
    question: DataTypes.STRING,
    type: DataTypes.STRING,
    images: DataTypes.ARRAY(DataTypes.STRING)
  });

  Question.associate = (models) => {
     Question.hasMany(models.QuestionAttr, {
        foreignKey: 'questionId',
        as: 'questionAttrs',
     });
  }
  return Question;
};