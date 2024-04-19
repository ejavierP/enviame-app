const SequelizeDeliveryRepository = require("../../deliviries/repositories/sequelize-delivery-repository");
const SequelizeDeliveryConfigHook = require("../../deliviries/repositories/sequelize-delivery-hook-repository");
const Op = require("sequelize").Op;
const {
  deliveryStatusSequence,
} = require("../../deliviries/utils/delivery-status.util");

const notifyOrderStatus = require("../../frameworks/adapters/orders-notifier");

const CronJob = require("cron").CronJob;

function scheduleOrderUpdate() {
  const sequelizeDeliveryRepository = new SequelizeDeliveryRepository();
  const deliveryConfigHookRepository = new SequelizeDeliveryConfigHook();

  const cronSchedule = process.env.DELIVERY_SCHEDULER_CRON_EXPRESSION;

  const job = new CronJob(cronSchedule, async () => {
    try {
      const deliveries = await sequelizeDeliveryRepository.getDeliveries();
      const deliveryConfigsHook =
        await deliveryConfigHookRepository.getDeliveriesHookConfig();

      deliveries.map(async (delivery) => {
        const lastTracking =
          await sequelizeDeliveryRepository.getDeliveryTracking({
            deliveryId: delivery.id,
            status: { [Op.not]: "DELIVERED" },
          });

        if (!lastTracking.isNotified) {
          const nextStatus = deliveryStatusSequence[lastTracking.status];

          const status = Array.isArray(nextStatus)
            ? nextStatus[Math.floor(Math.random() * nextStatus.length)]
            : nextStatus;

          if (deliveryConfigsHook[0]) {
            const nexTracking = {
              status,
              date: Date.now(),
              deliveryId: delivery.id,
              isNotified: false,
            };

            console.log(
              `Notificando Orden ${delivery.foreignOrderId} con el status: ${lastTracking.status}`
            );

            await sequelizeDeliveryRepository.createTracking(nexTracking);
            await notifyOrderStatus(deliveryConfigsHook[0], {
              status,
              orderId: delivery.foreignOrderId,
            });
            await sequelizeDeliveryRepository.updateDeliveryTracking({
              id: lastTracking.id,
              isNotified: true,
            });
          }
        }
      });
    } catch (error) {
      throw error;
    }
  });
  job.start();
}

module.exports = scheduleOrderUpdate;
