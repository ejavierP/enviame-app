module.exports = (sequelize, DataTypes) => {
  const deliveryModel = sequelize.define(
    "Delivery",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      foreignOrderId: { type: DataTypes.INTEGER, allowNull: false },
      customerName: { type: DataTypes.STRING, allowNull: false },
      originAddress: { type: DataTypes.STRING, allowNull: false },
      destinationAddress: { type: DataTypes.STRING, allowNull: false },
      trackingNumber: { type: DataTypes.STRING, allowNull: false },
      status: { type: DataTypes.STRING, allowNull: false },
      date: { type: DataTypes.BIGINT, allowNull: false },
    },
    {
      tableName: "Deliveries",
      timestamps: false,
    }
  );

  return deliveryModel;
};
