'use strict';
module.exports = (sequelize, DataTypes) => {
  var Question = sequelize.define('Question', {
    question: DataTypes.TEXT,
    type: DataTypes.STRING,
    images: {
        type: DataTypes.JSON
    },
    published: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    hints: {
        type: DataTypes.STRING,
        get: function () {
            if(this.getDataValue('hints')) return this.getDataValue('hints').split(';;')
        },
        set: function (val) {
            if(val) {
                let data = val.join(';;')
                this.setDataValue('hints',data);
            }
        }
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