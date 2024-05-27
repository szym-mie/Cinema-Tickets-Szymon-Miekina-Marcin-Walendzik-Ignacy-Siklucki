import { DataTypes } from 'sequelize';
import { Model } from '../Model.mjs';

const TicketModel = new Model(
    'Ticket',
    {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            validation: {
                is: /[0-9a-f]{96}/,
            },
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        showId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        seatNumber: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
    },
);

export default TicketModel;
