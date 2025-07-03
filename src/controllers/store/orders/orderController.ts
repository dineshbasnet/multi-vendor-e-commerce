import { Response, NextFunction } from "express";
import sequelize from "../../../database/connection";
import { IExtendedRequest } from "../../../Middlewares/type";

class OrderController {
    // Create a new order with items
    static async createOrder(req: IExtendedRequest, res: Response, next: NextFunction) {
        const storeIdClean = req.storeIdClean;
        const { customerName, customerPhone, items } = req.body; // items: [{productId, quantity, price}]
        let transaction;

     
            transaction = await sequelize.transaction();

            // Insert order
            const [orderResult]: any = await sequelize.query(
                `INSERT INTO orders_${storeIdClean} (customerName, customerPhone, totalAmount)
                 VALUES (?, ?, ?)`,
                {
                    replacements: [
                        customerName,
                        customerPhone,
                        items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
                    ],
                    transaction
                }
            );

            // Get the inserted order id (depends on DB, adjust if needed)
            const [[orderRow]]: any = await sequelize.query(
                `SELECT id FROM orders_${storeIdClean} ORDER BY createdAt DESC LIMIT 1`,
                { transaction }
            );
            const orderId = orderRow.id;

            // Insert order items
            for (const item of items) {
                await sequelize.query(
                    `INSERT INTO order_items_${storeIdClean} (orderId, productId, quantity, price)
                     VALUES (?, ?, ?, ?)`,
                    {
                        replacements: [orderId, item.productId, item.quantity, item.price],
                        transaction
                    }
                );
            }

            await transaction.commit();
            res.status(201).json({ message: "Order created", orderId });
        
    }

    // Get all orders (with items)
    static async getOrders(req: IExtendedRequest, res: Response, next: NextFunction) {
        const storeIdClean = req.storeIdClean;
        try {
            const [orders]: any = await sequelize.query(
                `SELECT * FROM orders_${storeIdClean} ORDER BY createdAt DESC`
            );
            for (const order of orders) {
                const [items]: any = await sequelize.query(
                    `SELECT * FROM order_items_${storeIdClean} WHERE orderId = ?`,
                    { replacements: [order.id] }
                );
                order.items = items;
            }
            res.json(orders);
        } catch (error) {
            next(error);
        }
    }

    // Update order status
    static async updateOrderStatus(req: IExtendedRequest, res: Response, next: NextFunction) {
        const storeIdClean = req.storeIdClean;
        const { orderId } = req.params;
        const { status } = req.body;
        try {
            await sequelize.query(
                `UPDATE orders_${storeIdClean} SET status = ? WHERE id = ?`,
                { replacements: [status, orderId] }
            );
            res.json({ message: "Order status updated" });
        } catch (error) {
            next(error);
        }
    }

    // Delete an order (and its items)
    static async deleteOrder(req: IExtendedRequest, res: Response, next: NextFunction) {
        const storeIdClean = req.storeIdClean;
        const { orderId } = req.params;
        let transaction;
        try {
            transaction = await sequelize.transaction();
            await sequelize.query(
                `DELETE FROM order_items_${storeIdClean} WHERE orderId = ?`,
                { replacements: [orderId], transaction }
            );
            await sequelize.query(
                `DELETE FROM orders_${storeIdClean} WHERE id = ?`,
                { replacements: [orderId], transaction }
            );
            await transaction.commit();
            res.json({ message: "Order deleted" });
        } catch (error) {
            if (transaction) await transaction.rollback();
            next(error);
        }
    }
}

export default OrderController;