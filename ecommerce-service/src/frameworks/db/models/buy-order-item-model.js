module.exports = (sequelize, DataTypes) => {
  const BuyOrderItemModel = sequelize.define(
    "BuyOrderItem",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "BuyOrderItems",
      timestamps: false,
    }
  );

  return BuyOrderItemModel;
};
