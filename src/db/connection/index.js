import UserModel from '../models/user-model.js';
import MetaModel from '../models/meta-model.js';
import { Sequelize, DataTypes } from 'sequelize';
import log from '../../utils/logging/log.js';

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './data/botdata.sqlite',
    logging: false
});

export const User = UserModel(sequelize, DataTypes);
export const Meta = MetaModel(sequelize, DataTypes);

export async function syncDatabase() {
    try {
        await sequelize.sync({ alter: true });
        log.action('DATABASE', '✅ Database schema synchronized successfully.');
    } catch (error) {
        log.error('DATABASE', `❌ Error synchronizing database schema: ${error.message}`, error);
    }
}

export const closeDB = async () => {
    try {
        await sequelize.close();
        log.action('DATABASE', '✅ Database connection closed.');
        process.exit(0);
    } catch (error) {
        log.error('DATABASE', `❌ Error closing database connection: ${error.message}`, error);
        process.exit(1);
    }
};
