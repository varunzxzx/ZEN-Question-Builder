'use strict';
module.exports = (sequelize, DataTypes) => {
  var MCQ = sequelize.define('MCQ', {
    question: DataTypes.STRING,
    images: DataTypes.ARRAY(DataTypes.STRING),
    options: DataTypes.ARRAY(DataTypes.STRING),
    answer: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return MCQ;
};