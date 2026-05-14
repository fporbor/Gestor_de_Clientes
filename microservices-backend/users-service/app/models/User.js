// Archivo: ./praticas-2026/microservices-backend/user-service/app/models/User.js
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class User extends Model {}

    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            passwordHash: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'user',
            },
            active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            },
            avatar: {
            type: DataTypes.STRING,
            allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'User',
        }
    );

    return User;
};