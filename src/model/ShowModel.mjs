import { DataTypes } from "sequelize";
import { Model } from "../Model.mjs";

const ShowModel = new Model(
    'Show',
    {
        ID: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        MovieID: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        RoomID: {
            type: DataTypes.TINYINT,
            allowNull: false,
        },
        StartTime: {
            type: DataTypes.TIME,
            allowNull: false,
        },
    }
);

export default ShowModel;