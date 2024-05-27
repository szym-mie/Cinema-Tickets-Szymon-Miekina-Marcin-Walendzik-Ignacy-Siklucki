import { DataTypes } from 'sequelize';
import { Model } from '../Model.mjs';

const UserModel = new Model(
    'User',
    {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        login: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /[0-9a-zA-Z_]{4,64}/,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /[0-9a-zA-Z_]+@[0-9a-zA-Z_.]+/,
            },
        },
        currentSession: {
            type: DataTypes.STRING,
            validate: {
                is: /[0-9a-f]{96}/,
            },
        },
    },
);

export default UserModel;
