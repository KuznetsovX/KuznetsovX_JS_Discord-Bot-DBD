export default (sequelize, DataTypes) => {
    return sequelize.define('User', {
        userId: { type: DataTypes.STRING, primaryKey: true },
        username: { type: DataTypes.STRING },
        roles: { type: DataTypes.STRING },
        warnings: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false }
    });
};
