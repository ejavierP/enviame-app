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
      createdBy: DataTypes.INTEGER,
    },
    options
  );

  BuyOrderModel.associate = function (models) {
    BuyOrderModel.belongsTo(models.User, {
      foreignKey: "sellerId",
      as: "user",
    });
    BuyOrderModel.belongsTo(models.User, {
      foreignKey: "createdBy",
      as: "createdBy",
    });
    BuyOrderModel.hasMany(models.BuyOrderItem, { as: "products" });
  };
  return BuyOrderModel;
};
