module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "UserRole",
    { id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true } },
    { timestamps: true }
  );
