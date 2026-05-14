import dotenv from 'dotenv';
dotenv.config();

export default {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: 'audit_service',
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
    migrationStorageTableName: 'SequelizeMeta'
};


