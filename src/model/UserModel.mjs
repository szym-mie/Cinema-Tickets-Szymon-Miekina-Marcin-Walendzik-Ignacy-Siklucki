import { DataTypes } from "sequelize";
import ModelDef from "../ModelDef.mjs";

const UserModel = new ModelDef(
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
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        CurrentSessionUUID: {
            type: DataTypes.UUID,
        }
    }
);

export default UserModel;