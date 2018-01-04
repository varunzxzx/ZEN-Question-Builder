'use strict';
module.exports = (sequelize, DataTypes) => {
  var QuestionAttr = sequelize.define('QuestionAttr', {
    options: {
        type: DataTypes.STRING,
        get: function () {
            if(this.getDataValue('options')) return this.getDataValue('options').split(';;')
        },
        set: function (val) {
            if(val) {
                let data = val.join(';;')
                this.setDataValue('options',data);
            }
        }
    },
    solution: {
        type: DataTypes.TEXT
    },
    correct: {
        type: DataTypes.STRING,
        get: function () {
            if(this.getDataValue('correct')) return this.getDataValue('correct').split(';;')
        },
        set: function (val) {
            if(val) {
                let data = val.join(';;')
                this.setDataValue('correct',data);
            }
        }
    },
    answer: DataTypes.TEXT,
    col1: {
        type: DataTypes.STRING,
        get: function () {
            if(this.getDataValue('col1')) return this.getDataValue('col1').split(';;')
        },
        set: function (val) {
            if(val) {
                let data = val.join(';;')
                this.setDataValue('col1',data);
            }
        }
    },
    col2: {
        type: DataTypes.STRING,
        get: function () {
            if(this.getDataValue('col2')) return this.getDataValue('col2').split(';;')
        },
        set: function (val) {
            if(val) {
                let data = val.join(';;')
                this.setDataValue('col2',data);
            }
        }
    },
    matchAnswer: DataTypes.JSON,
    matchSolution: DataTypes.TEXT,
    images: {
        type: DataTypes.JSON,
        // get: function () {
        //     return this.getDataValue('images').split(';;')
        // },
        // set: function (val) {
        //     this.setDataValue('images',val.join(';;'));
        // }
    }
  });

  QuestionAttr.associate = (models) => {
        QuestionAttr.belongsTo(models.Question, {
            foreignKey: 'question_id',
            onDelete: 'CASCADE',
        });
    }
  return QuestionAttr;
};