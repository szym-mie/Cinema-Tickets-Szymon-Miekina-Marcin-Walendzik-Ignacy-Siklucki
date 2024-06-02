import { DataTypes } from 'sequelize';
import { Model } from '../Model.mjs';

const LogModel = new Model(
    'Log',
    {
    //     // Primary key
    //     id: {
    //         type: DataTypes.BIGINT,
    //         allowNull: false,
    //         autoIncrement: true,
    //         primaryKey: true,
    //     },
    //     // Log type - INFO, ERROR
    //     type: {
    //         type: DataTypes.STRING,
    //         allowNull: false,
    //         validator: {
    //             isIn: [['INFO', 'ERROR']],
    //         },
    //     },
    //     // Log message - what happened
    //     message: {
    //         type: DataTypes.TEXT,
    //         allowNull: false,
    //     },
    //     // Time of event
    //     eventTime: {
    //         type: DataTypes.DATE,
    //         allowNull: false,
    //         defaultValue: DataTypes.NOW,
    //     },
    //     // Topic of the log - if possible name of the table modified
    //     about: {
    //         type: DataTypes.STRING,
    //         allowNull: true,
    //     },
    },
);

export default LogModel;
