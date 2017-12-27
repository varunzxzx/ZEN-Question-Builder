'use strict';
module.exports = (sequelize, DataTypes) => {
  var Question = sequelize.define('Question', {
    question: DataTypes.STRING,
    type: DataTypes.STRING,
    images: DataTypes.STRING,
    published: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
  });

  Question.associate = (models) => {
     Question.hasMany(models.QuestionAttr, {
        foreignKey: 'question_id',
        as: 'questionAttrs',
     });

     Question.belongsToMany(models.Tags, {
         through: {
             model: models.QuestionTag,
             unique: false,
             scope: {
                 taggable: 'post'
             }
         },
         as: 'tags',
         foreignKey: 'question_id',
         constraints: false
      });
  }
  return Question;
};