module.exports = (sequelizeClient, DataTypes, options) => {
  const userModel = sequelizeClient.sequelize.define(
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
    },
    options
  );

  userModel.associate = function (models) {
    userModel.hasMany(models.Store, { as: "stores" });
  };
  return userModel;
};