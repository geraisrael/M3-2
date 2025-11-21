'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Actor extends Model {
    static associate(models) {
      Actor.belongsToMany(models.Movie, {
        through: models.MovieActor,
        foreignKey: 'actorId',
        otherKey: 'movieId',
        as: 'movies'
      });
    }
  }
  
  Actor.init({
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
    modelName: 'Actor',
    tableName: 'actors',
    timestamps: true
  });
  
  return Actor;
};