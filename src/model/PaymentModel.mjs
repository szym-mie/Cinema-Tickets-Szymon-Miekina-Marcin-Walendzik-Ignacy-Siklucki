import { DataTypes } from 'sequelize';
import { Model } from '../Model.mjs';

const PaymentModel = new Model(
    'Payment',
    {
        // Primary key
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        // Title of this payment
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // User ID
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        // Payment token
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // Time issued
        issueTime: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        // Has order been paid for
        isPaid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
);

export default PaymentModel;
