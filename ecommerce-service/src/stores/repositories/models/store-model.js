module.exports = (sequelizeClient, DataTypes, options) => {
  const StoreModel = sequelizeClient.sequelize.define(
    "stores",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: DataTypes.STRING,
      description: DataTypes.STRING,
      warehouseAddress: DataTypes.STRING,
    },
    options
  );
  return StoreModel;
};
