'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    static associate(models) {
      Movie.belongsTo(models.Director, {
        foreignKey: 'directorId',
        as: 'director'
      });
      
      Movie.belongsToMany(models.Actor, {
        through: models.MovieActor,
        foreignKey: 'movieId',
        otherKey: 'actorId',
        as: 'actors'
      });
    }
  }
  
  Movie.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    releaseYear: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    genre: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Duración en minutos'
    },
    directorId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'directors',
        key: 'id'
      }
    },
    rating: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
      defaultValue: 0.0
    },
    language: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Español'
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'México'
    }
  }, {
    sequelize,
    modelName: 'Movie',
    tableName: 'movies',
    timestamps: true
  });
  
  return Movie;
};