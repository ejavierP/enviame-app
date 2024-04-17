module.exports = (sequelize, DataTypes) => {
  const userModel = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: DataTypes.STRING,
      email: DataTypes.STRING,
      shippingAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      tableName: "Users",
      timestamps: false,
    }
  );
  return userModel;
};
