import { Model } from 'sequelize'; //Cambiar nombre archivo

export default (sequelize, DataTypes) => {
    class Audit extends Model {
        static associate(models) {
            Audit.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user',
            });
        }
    }

    Audit.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            userEmail: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            action: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            entityType: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            entityId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            serviceName: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            metadata: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Audit',
            tableName: 'Audits', 
            freezeTableName: true,  
            timestamps: true,
        }
    );

    return Audit;
};
