import { DataTypes } from "sequelize";
import { Model } from "../Model.mjs";

const UserModel = new Model(
    'User',
    {
        ID: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        UUID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        Login: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /[0-9a-zA-Z_]{4,64}/
            },
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /[0-9a-zA-Z_]+@[0-9a-zA-Z_.]+/
            },
        },
        CurrentSessionUUID: {
            type: DataTypes.UUID,
        },
    },
);

export default UserModel;