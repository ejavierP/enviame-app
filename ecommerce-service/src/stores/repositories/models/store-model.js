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
      sellerId: DataTypes.INTEGER,
    
    },
    options
  );
  StoreModel.associate = function (models) {
    StoreModel.belongsTo(models.User, { foreignKey: "sellerId", as: "user" });
  };
  return StoreModel;
};
