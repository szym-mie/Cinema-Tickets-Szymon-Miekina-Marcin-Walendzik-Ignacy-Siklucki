import { DataTypes } from 'sequelize';
import { Model } from '../Model.mjs';

const ShowModel = new Model(
    'Show',
    {
        // Primary key
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        // ID of shown movie
        movieId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        // ID of used room
        roomId: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
        // Start time of a movie
        startTime: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        // Price per ticket
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
    },
);

export default ShowModel;
