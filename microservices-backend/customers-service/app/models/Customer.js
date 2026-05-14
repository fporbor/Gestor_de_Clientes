import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Customer extends Model {
        static associate(models) {
            Customer.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user',
            });
        }
    }

    Customer.init(
        {
            id:      { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            name:    { type: DataTypes.STRING,  allowNull: false },
            email:   { type: DataTypes.STRING,  allowNull: false },
            phone:   { type: DataTypes.STRING },
            address: { type: DataTypes.STRING },
            status:  { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' },
            dni: {
                type:      DataTypes.STRING(9),
                allowNull: false,
                unique:    true,
            },
            userId: {
                type:       DataTypes.INTEGER,
                allowNull:  false,
            },
        },
        {
            sequelize,
            modelName: 'Customer',
        }
    );

    return Customer;
};