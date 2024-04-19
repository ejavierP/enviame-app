module.exports = (sequelize, DataTypes) => {
  const deliveryHook = sequelize.define(
    "DeliveryHook",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      url: { type: DataTypes.STRING, allowNull: false },
      apiKey: { type: DataTypes.STRING, allowNull: false },
    },
    {
      tableName: "DeliveryConfigHook",
      timestamps: false,
    }
  );

  return deliveryHook;
};
