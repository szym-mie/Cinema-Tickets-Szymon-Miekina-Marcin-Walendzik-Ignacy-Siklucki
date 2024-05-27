import { DataTypes } from 'sequelize';
import { Model } from '../Model.mjs';

const MovieModel = new Model(
    'Movie',
    {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        runtime: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
);

export default MovieModel;
