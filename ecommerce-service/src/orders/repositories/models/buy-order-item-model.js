module.exports = (sequelizeClient, DataTypes, options) => {
  const BuyOrderItemModel = sequelizeClient.sequelize.define(
    "BuyOrderItem",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      sku: DataTypes.STRING,
      quantity: DataTypes.STRING,
      buyOrderId: DataTypes.INTEGER,
    },
    options
  );

  BuyOrderItemModel.associate = function (models) {
    BuyOrderItemModel.belongsTo(models.BuyOrder, { foreignKey: "buyOrderId",
    as: "BuyOrder",});
  };
  return BuyOrderItemModel;
};
