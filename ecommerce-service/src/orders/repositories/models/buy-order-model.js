module.exports = (sequelizeClient, DataTypes, options) => {
  const BuyOrderModel = sequelizeClient.sequelize.define(
    "BuyOrder",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      amount: DataTypes.DOUBLE,
      status: DataTypes.STRING,
      createdDate: DataTypes.STRING,
      sellerId: DataTypes.INTEGER,
      storeAddress: DataTypes.STRING,
      customerName: DataTypes.STRING,
      customerAddress: DataTypes.STRING,
    },
    options
  );

  BuyOrderModel.associate = function (models) {
    BuyOrderModel.belongsTo(models.User, {
      foreignKey: "sellerId",
      as: "user",
    });
    BuyOrderModel.hasMany(models.BuyOrderItem, {as: "products"});
  };
  return BuyOrderModel;
};
