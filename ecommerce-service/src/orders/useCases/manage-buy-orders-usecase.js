const BuyOrder = require("../entities/buy-order");
const {
  BadRequestException,
  NotFoundException,
} = require("../../frameworks/http/errors/index");

class ManageBuyOrdersUsecase {
  constructor(buyOrdersRepository, productsRepository, storesRepository) {
    this.buyOrdersRepository = buyOrdersRepository;
    this.productsRepository = productsRepository;
    this.storesRepository = storesRepository;
  }

  async createBuyOrder(buyOrderData, userData) {
    try {
      const productItems = await this.transformProducts(buyOrderData.products);
      const buyOrdersGrouped = this.groupProductsOrders(productItems, userData);
      await Promise.all(
        buyOrdersGrouped.map(async (buyOrder) => {
          await this.buyOrdersRepository.createBuyOrder(buyOrder);
        })
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async transformProducts(items) {
    let productItems = [];
    await Promise.all(
      items.map(async (buyOrderproduct) => {
        const product = await this.productsRepository.getProduct(
          buyOrderproduct.id
        );

        if (!product) {
          throw new NotFoundException(
            `No se encontro el producto con el id ${buyOrderproduct.id} `
          );
        }
        if (buyOrderproduct.quantity > product.quantity) {
          throw new BadRequestException(
            `${product.name} no tiene suficientes cantidades`
          );
        }

        const store = await this.storesRepository.getStore(product.storeId);
        if (!store) {
          throw new NotFoundException(
            `No se encontro la tienda para el producto ${product.name} `
          );
        }

        if (!store.warehouseAddress) {
          throw new BadRequestException(
            `Se debe asignar una direccion de almacen para poder comprar en la tienda: ${store.name}`
          );
        }
        productItems.push({
          name: product.name,
          sku: product.sku,
          quantity: product.quantity,
          sellerId: store.sellerId,
          warehouseAddress: store.warehouseAddress,
          price: product.price,
        });
      })
    );
    return productItems;
  }

  groupProductsOrders(products, userData) {
    const buyOrders = [];
    let productInBuyOrderIndex;
    products.map((product) => {
      if (buyOrders?.length) {
        productInBuyOrderIndex = buyOrders.findIndex((x) =>
          x?.products.findIndex((p) => p.sellerId === product.sellerId)
        );
        
      }
      if (productInBuyOrderIndex > -1 ) {
        buyOrders[productInBuyOrderIndex].products.push({
          name: product.name,
          sku: product.sku,
          quantity: product.quantity,
        });
      } else {
        const buyOrder = new BuyOrder(
          undefined,
          "created",
          [
            {
              name: product.name,
              sku: product.sku,
              quantity: product.quantity,
            },
          ],
          product.sellerId,
          userData.shippingAddress,
          userData.name,
          product.warehouseAddress
        );
        buyOrders.push(buyOrder);
      }
    });
    return buyOrders;
  }
}

module.exports = ManageBuyOrdersUsecase;
