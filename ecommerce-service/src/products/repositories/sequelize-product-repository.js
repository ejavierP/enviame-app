const { DataTypes } = require("sequelize");
const ProductModel = require("./models/product-model");

class SequelizeProductRepository {
  constructor(sequelizeClient, test = false) {
    this.sequelizeClient = sequelizeClient;
    this.test = test;

    let tableName = "products";

    if (test) {
      tableName += "_test";
    }

    const options = {
      tableName: tableName,
      timestamps: false,
    };

    this.productModel = ProductModel(sequelizeClient,DataTypes,options);
  }

  async getProducts() {
    const products = await this.productModel.findAll({
      raw: true,
    });

    return products;
  }

  async getProduct(id) {
    return await this.productModel.findByPk(id);
  }

  async createProduct(product) {
    const data = await this.productModel.create(product);
    return data.id;
  }

  async updateProduct(product) {
    const options = {
      where: {
        id: product.id,
      },
    };

    await this.productModel.update(product, options);
  }

  async deleteProduct(id) {
    const product = await this.productModel.findOne({ where: { id } });
    await product.destroy();
  }

  async deleteAllProducts() {
    if (this.test) {
      const options = {
        truncate: true,
      };

      await this.productModel.destroy(options);
    }
  }

  async dropProductTable() {
    if (this.test) {
      await this.productModel.drop();
    }
  }
}

module.exports = SequelizeProductRepository;
