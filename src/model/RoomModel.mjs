import { DataTypes } from "sequelize";
import { Model } from "../Model.mjs";

const RoomModel = new Model(
    'Room',
    {
        ID: {
            type: DataTypes.TINYINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        Number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Seats: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
    },
);

export default RoomModel;