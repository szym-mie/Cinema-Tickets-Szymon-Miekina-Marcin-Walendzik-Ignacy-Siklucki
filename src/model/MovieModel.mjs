import { DataTypes } from 'sequelize';
import { Model } from '../Model.mjs';

const MovieModel = new Model(
    'Movie',
    {
        // Primary key
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        // Movie title
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // Not short description of this movie
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        // URL to the poster
        posterUrl: {
            type: DataTypes.STRING,
        },
        // Year released
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        // Runtime in minutes
        runtime: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
);

export default MovieModel;
