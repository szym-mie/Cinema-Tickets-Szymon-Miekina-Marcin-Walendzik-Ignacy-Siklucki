import { DataTypes } from 'sequelize';
import { Model } from '../Model.mjs';

const RoomModel = new Model(
    'Room',
    {
        id: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        seats: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
    },
);

export default RoomModel;
