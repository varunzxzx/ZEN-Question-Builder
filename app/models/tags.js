'use strict';
module.exports = (sequelize, DataTypes) => {
  var Tags = sequelize.define('Tags', {
    tag: DataTypes.STRING
  });

  Tags.associate = (models) => {
      Tags.belongsToMany(models.Question, {
          through: {
              model: models.QuestionTag,
              unique: false
          },
          foreignKey: 'tag_id'
      });
  }
  return Tags;
};