module.exports = (sequelize, DataTypes) => {
  const BuyOrderModel = sequelize.define(
    "BuyOrder",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      status:  {
        type:DataTypes.STRING,
        allowNull: false,
      },
      createdDate: {
        type:DataTypes.STRING,
        allowNull: false,
      },
      storeAddress: {
        type:DataTypes.STRING,
        allowNull: false,
      },
      customerName: {
        type:DataTypes.STRING,
        allowNull: false,
      },
      customerAddress: {
        type:DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      tableName: "BuyOrders",
      timestamps: false,
    }
  );


  return BuyOrderModel;
};
