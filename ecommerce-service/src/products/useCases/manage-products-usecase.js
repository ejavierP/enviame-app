
const {
  BadRequestException,
  NotFoundException,
} = require("../../frameworks/http/errors/index");
const Product = require("../entities/product");
class ManageProductUsecase {
  constructor(productsRepository, storesRepository) {
    this.storesRepository = storesRepository;
    this.productsRepository = productsRepository;
  }

  async getProducts() {
    return await this.productsRepository.getProducts();
  }

  async getProduct(id) {
    const product = await this.productsRepository.getProduct(id);
    if (!product) {
      throw new NotFoundException(
        "No se encontro un producto con el id especificado"
      );
    }
    return product;
  }

  async createProduct(data) {
    const product = new Product(
      undefined,
      data.name,
      data.description,
      data.quantity,
      data.sku,
      data.price,
      data.storeId
    );
    const store = await this.storesRepository.getStore(data.storeId);
    if (!store) {
      throw new NotFoundException(
        "No se encontraron resultados para la tienda con el storeId especificado"
      );
    }
    const id = await this.productsRepository.createProduct(product);
    product.id = id;

    return product;
  }

  async updateProduct(id, data) {
    try {
      const product = new Product(
        id,
        data.name,
        data.description,
        data.quantity,
        data.sku,
        data.price,
        data.storeId
      );
      await this.productsRepository.updateProduct(product);

      return product;
    } catch (error) {
      throw new BadRequestException("Ocurrio un error actualizando el producto");
    }
  }

  async deleteProduct(id) {
    try {
      await this.productsRepository.deleteProduct(id);
    } catch (error) {
      throw new BadRequestException("Ocurrio un error borrando el producto");
    }
  }
}

module.exports = ManageProductUsecase;
