module.exports = (sequelizeClient, DataTypes, options) => {
  const ProductModel = sequelizeClient.sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: DataTypes.STRING,
      description: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      sku: {
        type: DataTypes.STRING,
        unique: true
      },
      price: DataTypes.DOUBLE,
      storeId: DataTypes.INTEGER,
    
    },
    options
  );
  ProductModel.associate = function (models) {
    ProductModel.belongsTo(models.Store, { foreignKey: "storeId", as: "store" });
  };
  return ProductModel;
};
