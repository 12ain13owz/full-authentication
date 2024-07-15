module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      firstname: { type: DataTypes.STRING, allowNull: false },
      lastname: { type: DataTypes.STRING, allowNull: false },
      avatar: { type: DataTypes.STRING },
      verified: { type: DataTypes.BOOLEAN, defaultValue: false },
      verificationCode: { type: DataTypes.STRING },
      passwordResetCode: { type: DataTypes.STRING },
      passwordExpired: { type: DataTypes.DATE },
      active: { type: DataTypes.BOOLEAN, defaultValue: true },
      remark: { type: DataTypes.TEXT },
    },
    { timestamps: true }
  );
