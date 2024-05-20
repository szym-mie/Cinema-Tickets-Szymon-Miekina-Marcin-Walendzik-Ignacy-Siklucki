import { DataTypes } from "sequelize";
import { Model } from "../Model.mjs";

const MovieModel = new Model(
    'Movie',
    {
        ID: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        Title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Year: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Runtime: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
);

export default MovieModel;