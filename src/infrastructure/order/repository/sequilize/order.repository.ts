import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {

  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: {
          id: id,
        },
      })
    } catch (error) {
      throw new Error("Order not found");
    }

    const orderItems = orderModel.items.map((item) => (new OrderItem(
      item.id,
      item.name,
      item.price,
      item.product_id,
      item.quantity,
    )));

    const order = new Order(orderModel.id, orderModel.customer_id, orderItems)
    return order;
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll();

    const orders = orderModels.map((orderModel) => {

      let orderItems = orderModel.items.map((item) => (new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        item.quantity,
      )));

      let order = new Order(orderModel.id, orderModel.customer_id, orderItems);
      return order;
    });

    return orders;
  }

  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.sequelize.transaction(async (transaction) => {
      await OrderModel.update(
        {
          customer_id: entity.customerId,
          total: entity.total(),
        },
        {
          where: {
            id: entity.id,
          },
          transaction,
        }
      );

      const currentItems = await OrderItemModel.findAll({
        where: {
          order_id: entity.id,
        },
        transaction,
      });

      const currentItemIds = currentItems.map((item) => item.id);
      const updatedItemIds = entity.items.map((item) => item.id);

      const itemsToRemove = currentItemIds.filter((id) => !updatedItemIds.includes(id));
      const itemsToAdd = entity.items.filter((item) => !currentItemIds.includes(item.id));
      const itemsToUpdate = entity.items.filter((item) => currentItemIds.includes(item.id));

      // Remove items that are no longer in the order
      await OrderItemModel.destroy({
        where: {
          id: itemsToRemove,
        },
        transaction,
      });

      // Add new items
      for (const item of itemsToAdd) {
        await OrderItemModel.create(
          {
            id: item.id,
            order_id: entity.id,
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,
          },
          { transaction }
        );
      }

      // Update existing items
      for (const item of itemsToUpdate) {
        await OrderItemModel.update(
          {
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,
          },
          {
            where: {
              id: item.id,
            },
            transaction,
          }
        );
      }
    });
  }
}
