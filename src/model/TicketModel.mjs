import { DataTypes } from 'sequelize';
import { Model } from '../Model.mjs';

const TicketModel = new Model(
    'Ticket',
    {
        // Primary key
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        // Unique ticket token for verification
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            validation: {
                is: /[0-9a-f]{96}/,
            },
        },
        // User ID of buyer
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        // ID of show being booked
        showId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        // ID of the payment
        paymentId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        // Seat number being booked
        seatNumber: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
    },
);

export default TicketModel;
