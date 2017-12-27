'use strict';
module.exports = (sequelize, DataTypes) => {
  var QuestionTag = sequelize.define('QuestionTag', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    tag_id: {
      type: DataTypes.INTEGER
    },
    question_id: {
      type: DataTypes.INTEGER
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return QuestionTag;
};