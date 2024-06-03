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
        // // ID of shown movie
        movieId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        // // ID of used room
        roomId: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
        // // Day of the movie
        // startDate: {
        //     type: DataTypes.DATEONLY,
        //     allowNull: false,
        // },
        // // Start time of a movie
        // startTime: {
        //     type: DataTypes.DATE,
        //     allowNull: false,
        // },
        // // Price per ticket
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        // Date only
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        // Time column (hours and minutes only)
        time: {
            type: DataTypes.TIME,
            allowNull: false,
        },
    },
);

export default ShowModel;
