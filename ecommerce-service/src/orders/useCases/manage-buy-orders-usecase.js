const BuyOrder = require("../entities/buy-order");
const {
  BadRequestException,
  NotFoundException,
} = require("../../frameworks/http/errors/index");

const { orderStatusSequence } = require("../utils/order-status-sequence-util");

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

      await Promise.all([
        buyOrdersGrouped.map(async (buyOrder) => {
          await this.buyOrdersRepository.createBuyOrder(buyOrder);
        }),
        await this.reduceProductStock(productItems),
      ]);
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
        const availableStock = product.quantity - buyOrderproduct.quantity;
        productItems.push({
          id: product.id,
          name: product.name,
          sku: product.sku,
          quantity: buyOrderproduct.quantity,
          warehouseAddress: store.warehouseAddress,
          price: product.price,
          availableStock: availableStock,
          sellerId: store.sellerId,
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

      if (productInBuyOrderIndex > -1) {
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
          product.warehouseAddress,
          userData.id
        );
        buyOrders.push(buyOrder);
      }
    });
    return buyOrders;
  }

  async reduceProductStock(products) {
    products.map(async (productItem) => {
      await this.productsRepository.updateProduct({
        id: productItem.id,
        quantity: productItem.availableStock,
      });
    });
  }

  async getBuyOrders(filters) {
    return await this.buyOrdersRepository.getBuyOrdersWithFilters(filters);
  }

  async getBuyOrder(filters) {
    try {
      const buyOrder = await this.buyOrdersRepository.getBuyOrderWithFilters(
        filters
      );

      if (!buyOrder) {
        throw new NotFoundException(
          `No se encontro una orden para el id ${filters.id} `
        );
      }
      return buyOrder;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const buyOrder = await this.buyOrdersRepository.getBuyOrder(orderId);

      if (buyOrder) {
        const nextOrderStatus = orderStatusSequence[buyOrder.status];

        if (nextOrderStatus && nextOrderStatus === status) {
          await this.buyOrdersRepository.updateBuyOrder({
            id: orderId,
            status,
          });
        } else {
          throw new BadRequestException(
            `El status enviado no corresponde a la secuencia proximo: ${nextOrderStatus.toUpperCase()}`
          );
        }
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

module.exports = ManageBuyOrdersUsecase;
