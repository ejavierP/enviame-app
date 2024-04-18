module.exports = (sequelize, DataTypes) => {
  const deliveryTracking = sequelize.define(
    "DeliveryTracking",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      trackingNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      status: { type: DataTypes.STRING, allowNull: false },
      date: { type: DataTypes.STRING, allowNull: false },
    },
    {
      tableName: "DeliveryTrackings",
      timestamps: false,
    }
  );

  return deliveryTracking;
};
