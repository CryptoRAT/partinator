import sequelize from '@db/sequelize';
import { Order, Product } from '@models/index';
import { OptimisticLockError, Transaction } from 'sequelize';
import * as console from "node:console";

interface OrderProduct {
    productId: number;
    quantity: number;
}

interface CreateOrderInput {
    customerName: string;
    products: OrderProduct[];
}

const MAX_RETRIES = 3;

export const createOrder = async ({ customerName, products }: CreateOrderInput) => {
    if (products.some(({ quantity }) => quantity <= 0)) {
        throw new Error('Quantity must be greater than zero');
    }

    return await sequelize.transaction(
        { isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE },
        async (transaction) => {
            // Create the order within the transaction
            const order = await Order.create({ customerName, status: 'pending' }, { transaction });

            // Add products to the order and update inventory within the same transaction
            await addProductsToOrder(order.getDataValue('id'), products, transaction);

            // Retrieve the full order details including products
            const fullOrder = await Order.findByPk(order.getDataValue('id'), {
                include: [{ model: Product }],
                transaction,
            });

            // Check if the full order was retrieved successfully
            if (!fullOrder) {
                throw new Error('Failed to retrieve the order details after creation');
            }

            return fullOrder.get({ plain: true });
        }
    );
};

export const addProductsToOrder = async (orderId: number, products: OrderProduct[], transaction: any) => {
    let retries = 0;

    while (retries < MAX_RETRIES) {
        try {
            for (const { productId, quantity } of products) {

                // Step 1: Find the product in the database and lock it for update
                const product = await Product.findByPk(productId, {
                    transaction,
                    lock: transaction.LOCK.UPDATE, // Locks the row for update to prevent other transactions from modifying it concurrently
                });

                if (!product) {
                    console.error(`Product not found for ID: ${productId}`);
                    throw new Error('Product not found');
                }

                // Step 2: Check the available inventory for the product
                let inventory = product.getDataValue('inventory');

                // Step 3: Verify that there is enough inventory to fulfill the requested quantity
                if (inventory < quantity) {
                    throw new Error('Not enough inventory available');
                }

                // Step 4: Proceed to update the product's inventory
                await product.update(
                    { inventory: inventory - quantity },
                    { transaction, where: { id: productId, version: product.getDataValue('version') } }
                );

                // Step 5: Add the product to the order
                const order = await Order.findByPk(orderId, { transaction });

                if (order) {
                    await order.addProduct(product, { through: { quantity }, transaction });
                }

            }
            return; // Exit the loop if successful
        } catch (error) {
            if (error instanceof OptimisticLockError) {
                retries++;
                console.warn(`Optimistic lock failure, retrying (${retries}/${MAX_RETRIES})`);
                if (retries >= MAX_RETRIES) {
                    throw new Error('Failed to update product inventory after several attempts. Please try again.');
                }
            } else {
                throw error; // Throw other errors directly
            }
        }
    }
};


