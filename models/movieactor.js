'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MovieActor extends Model {
    static associate(models) {
      // Relaciones ya definidas en Movie y Actor
    }
  }
  
  MovieActor.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    movieId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'movies',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    actorId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'actors',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    characterName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'MovieActor',
    tableName: 'movie_actors',
    timestamps: true
  });
  
  return MovieActor;
};