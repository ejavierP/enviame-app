const { DataTypes } = require("sequelize");
const { db } = require("../../frameworks/db/sequelize");

class SequelizeProductRepository {
  constructor() {
    this.productModel = db.Product
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
