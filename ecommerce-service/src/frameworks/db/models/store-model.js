module.exports = (sequelize, DataTypes) => {
  const StoreModel = sequelize.define(
    "Store",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: false },
      warehouseAddress: { type: DataTypes.STRING, allowNull: true },
    },
    {
      tableName: "Stores",
      timestamps: false,
    }
  );

  return StoreModel;
};
