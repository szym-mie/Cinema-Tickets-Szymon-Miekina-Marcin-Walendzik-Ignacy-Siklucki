import { DataTypes } from "sequelize";
import { Model } from "../Model.mjs";

const TicketModel = new Model(
    'Ticket',
    {
        ID: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        UserID: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        ShowID: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        SeatNumber: {
            type: DataTypes.SMALLINT,
            allowNull: false
        },
    },
);

export default TicketModel;