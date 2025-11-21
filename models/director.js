'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Director extends Model {
    static associate(models) {
      Director.hasMany(models.Movie, {
        foreignKey: 'directorId',
        as: 'movies'
      });
    }
  }
  
  Director.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birthYear: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    birthPlace: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notableAwards: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    }
  }, {
    sequelize,
    modelName: 'Director',
    tableName: 'directors',
    timestamps: true
  });
  
  return Director;
};