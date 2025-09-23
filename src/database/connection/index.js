import dotenv from 'dotenv';
dotenv.config();

import { Sequelize, DataTypes } from 'sequelize';
import MetaModel from '../models/meta-model.js';
import UserModel from '../models/user-model.js';
import log from '../../utils/logging/log.js';

// Connect to PostgreSQL
export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        logging: false,
    }
);

// Initialize models
export const User = UserModel(sequelize, DataTypes);
export const Meta = MetaModel(sequelize, DataTypes);

// Synchronize tables
export async function syncDatabase() {
    try {
        await sequelize.sync({ alter: true });
        log.action('DATABASE', '✅ Database schema synchronized successfully.');
    } catch (error) {
        log.error('DATABASE', `❌ Error synchronizing database schema: ${error.message}`, error);
    }
}

// Close connection
export const closeDB = async () => {
    try {
        await sequelize.close();
        log.action('DATABASE', '✅ Database connection closed.');
    } catch (error) {
        log.error('DATABASE', `❌ Error closing database connection: ${error.message}`, error);
    }
};
