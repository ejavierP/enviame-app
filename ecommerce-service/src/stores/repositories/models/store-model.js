module.exports = (sequelizeClient, DataTypes, options) => {
  const StoreModel = sequelizeClient.sequelize.define(
    "Store",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: DataTypes.STRING,
      description: DataTypes.STRING,
      warehouseAddress: DataTypes.STRING,
      sellerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    options
  );
  StoreModel.associate = function (models) {
    StoreModel.belongsTo(models.User, { foreignKey: "sellerId", as: "user" });
  };
  return StoreModel;
};
