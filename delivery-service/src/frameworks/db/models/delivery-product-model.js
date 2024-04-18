module.exports = (sequelize, DataTypes) => {
  const deliveryProductModel = sequelize.define(
    "DeliveryProduct",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      sku: { type: DataTypes.STRING, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      qty: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: "DeliveryProducts",
      timestamps: false,
    }
  );

  return deliveryProductModel;
};
