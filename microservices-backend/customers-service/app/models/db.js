import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../database/createDB.js';
import dbCustomers from './Customer.js';

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const Customer = dbCustomers(sequelize, DataTypes);

db.customers = Customer;
db.models    = { Customer };

export default db;