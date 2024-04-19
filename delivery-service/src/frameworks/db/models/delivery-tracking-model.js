module.exports = (sequelize, DataTypes) => {
  const deliveryTracking = sequelize.define(
    "DeliveryTracking",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      status: { type: DataTypes.STRING, allowNull: false },
      date: { type: DataTypes.BIGINT, allowNull: false },
      isNotified: { type: DataTypes.BOOLEAN, allowNull: false },
    },
    {
      tableName: "DeliveryTrackings",
      timestamps: false,
    }
  );

  return deliveryTracking;
};
