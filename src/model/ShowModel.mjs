import { DataTypes } from 'sequelize';
import { Model } from '../Model.mjs';

const ShowModel = new Model(
    'Show',
    {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        movieId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        roomId: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
        startTime: {
            type: DataTypes.TIME,
            allowNull: false,
        },
    },
);

export default ShowModel;
