import { DataTypes } from 'sequelize';
import { Model } from '../Model.mjs';

const UserModel = new Model(
    'User',
    {
        // Primary key
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        // Login of user
        login: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                is: /[0-9a-zA-Z_]{4,64}/,
            },
        },
        // Hashed password
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // User email
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /[0-9a-zA-Z_]+@[0-9a-zA-Z_.]+/,
            },
        },
        // Current session token
        currentSession: {
            type: DataTypes.STRING,
            validate: {
                is: /[0-9a-f]{96}/,
            },
        },
    },
);

export default UserModel;
