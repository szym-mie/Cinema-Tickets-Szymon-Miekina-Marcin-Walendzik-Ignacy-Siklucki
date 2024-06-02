import { DataTypes } from 'sequelize';
import { Model } from '../Model.mjs';

const RoomModel = new Model(
    'Room',
    {
        // Primary key
        id: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        // Room number
        number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // Number of seats
        seats: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
    },
);

export default RoomModel;
