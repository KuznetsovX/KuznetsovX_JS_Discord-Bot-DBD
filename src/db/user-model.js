import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './data/botdata.sqlite',
    logging: false,
});

export const User = sequelize.define('User', {
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    roles: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

export { sequelize };
