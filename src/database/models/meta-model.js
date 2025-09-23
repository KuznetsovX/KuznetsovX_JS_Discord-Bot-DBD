export default (sequelize, DataTypes) => {
    return sequelize.define('Meta', {
        key: { type: DataTypes.STRING, primaryKey: true },
        value: { type: DataTypes.STRING }
    });
};
