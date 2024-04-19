const BuyOrder = require("../entities/buy-order");
const {
  BadRequestException,
  NotFoundException,
} = require("../../frameworks/http/errors/index");

const { orderStatusSequence } = require("../utils/order-status-sequence-util");
const { orderStatus } = require("../utils/order-status-util");
const notifyDelivery = require("../../adapters/delivery-notifier");

class ManageBuyOrdersUsecase {
  constructor(buyOrdersRepository, productsRepository, storesRepository) {
    this.buyOrdersRepository = buyOrdersRepository;
    this.productsRepository = productsRepository;
    this.storesRepository = storesRepository;
  }

  async createBuyOrder(buyOrderData, userData) {
    try {
      const productItems = await this.transformProducts(buyOrderData.products);

      const buyOrdersGrouped = this.orderProductBySeller(
        productItems,
        userData
      );

      await Promise.all([
        buyOrdersGrouped.map(async (buyOrder) => {
          await this.buyOrdersRepository.createBuyOrder(buyOrder);
        }),
        await this.discountProductStock(productItems),
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

  orderProductBySeller(products, userData) {
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
          productId: product.id,
        });
      } else {
        const buyOrder = new BuyOrder(
          undefined,
          orderStatus.CREATED,
          [
            {
              name: product.name,
              sku: product.sku,
              quantity: product.quantity,
              productId: product.id,
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

  async discountProductStock(products) {
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

  async updateOrderStatus(orderId, status, origin) {
    try {
      const buyOrder = await this.buyOrdersRepository.getBuyOrderWithFilters({
        id: orderId,
      });

      const nextOrderStatus = orderStatusSequence[buyOrder.status];

      if (buyOrder) {
        if (origin && origin === "ORDERS") {
          if (nextOrderStatus && nextOrderStatus !== status) {
            throw new BadRequestException(
              `El status enviado no corresponde a la secuencia proximo: ${nextOrderStatus.toUpperCase()}`
            );
          }
        }

        await this.buyOrdersRepository.updateBuyOrder({
          id: orderId,
          status,
        });

        if (nextOrderStatus && nextOrderStatus === orderStatus.DISPATCHED) {
          const items = await this.buyOrdersRepository.getBuyOrderItems({
            buyOrderId: buyOrder.id,
          });
          const deliveryOrder = this.transformOrderToDelivery(buyOrder, items);
          await notifyDelivery(deliveryOrder);
        }
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  transformOrderToDelivery(buyOrder, items) {
    const products = items.map((product) => {
      return {
        sku: product.sku,
        name: product.name,
        qty: product.quantity,
      };
    });
    const deliveryOrder = {
      foreignOrderId: buyOrder.id,
      origin: { address: buyOrder.storeAddress },
      destination: {
        name: buyOrder.customerName,
        address: buyOrder.customerAddress,
      },
      status: orderStatus.DISPATCHED,
      products: products,
    };
    return deliveryOrder;
  }

  async cancelBuyOrder(orderId) {
    try {
      const buyOrder = await this.buyOrdersRepository.getBuyOrderWithFilters({
        id: orderId,
      });

      if (
        (buyOrder && buyOrder.status === orderStatus.DISPATCHED) ||
        buyOrder.status === orderStatus.CANCELLED
      ) {
        throw new BadRequestException(
          `No se puede cancelar una orden en el status actual : ${buyOrder.status}`
        );
      }
      if (buyOrder) {
        await Promise.all(
          buyOrder.buyOrderItems.map(async (orderItem) => {
            const product = await this.productsRepository.getProduct(
              orderItem.dataValues.productId
            );
            await this.productsRepository.updateProduct({
              id: orderItem.productId,
              quantity: orderItem.dataValues.quantity + product.quantity,
            });
            await this.buyOrdersRepository.updateBuyOrder({
              id: orderId,
              status: orderStatus.CANCELLED,
            });
          })
        );
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

module.exports = ManageBuyOrdersUsecase;
