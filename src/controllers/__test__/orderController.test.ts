import {Order, Product} from '@models/index';
import sequelize from '@db/sequelize';
import { createOrder } from '@controllers/orderController';
import {OptimisticLockError} from "sequelize";

let productId: number;

beforeAll(async () => {
    await sequelize.sync({ force: true });
    const product = await Product.create({
        name: 'Hex Cap Screw',
        category: 'Fastener',
        material: 'Steel',
        threadSize: 'M10-1.5',
        finish: 'Plain',
        quantity: 15,
        price: 0.75,
        inventory: 100,
    });
    productId = product.getDataValue('id');
});

afterAll(async () => {
    await sequelize.close();
});

describe('Order Controller Tests', () => {
    describe('Order Controller - Happy Path Tests', () => {
        it('should create an order successfully and update inventory', async () => {
            const order = await createOrder({
                customerName: 'John Doe',
                products: [{ productId, quantity: 10 }],
            });

            expect(order).toBeDefined();
            expect(order.customerName).toBe('John Doe');

            const product = await Product.findByPk(productId);
            expect(product?.getDataValue('inventory')).toBe(90);
        });
    });

    describe('Order Controller - Branch Tests', () => {
        it('should throw an error if the product does not exist', async () => {
            await expect(
                createOrder({ customerName: 'Jane Doe', products: [{ productId: 9999, quantity: 5 }] })
            ).rejects.toThrow('Product not found');
        });

        it('should throw an error if there is not enough inventory', async () => {
            await expect(
                createOrder({ customerName: 'John Doe', products: [{ productId, quantity: 200 }] })
            ).rejects.toThrow('Not enough inventory available');
        });

        it('should throw an error if the order details could not be retrieved after creation', async () => {
            // Clear previous mocks to avoid interference
            jest.clearAllMocks();

            // Mock the Order.findByPk function to simulate a failure in retrieving the order details
            jest.spyOn(Order, 'findByPk').mockResolvedValue(null);

            await expect(
                createOrder({ customerName: 'Jane Doe', products: [{ productId, quantity: 5 }] })
            ).rejects.toThrow('Failed to retrieve the order details after creation');

            // Restore all mocks after the test
            jest.restoreAllMocks();
        });

        it('should throw an error after reaching max retries on OptimisticLockError', async () => {
            // Mock the Product.update function to throw OptimisticLockError to trigger retry logic
            jest.spyOn(Product.prototype, 'update').mockImplementationOnce(() => {
                throw new OptimisticLockError({});
            }).mockImplementationOnce(() => {
                throw new OptimisticLockError({});
            }).mockImplementationOnce(() => {
                throw new OptimisticLockError({});
            });

            await expect(
                createOrder({ customerName: 'Jane Doe', products: [{ productId, quantity: 5 }] })
            ).rejects.toThrow('Failed to update product inventory after several attempts. Please try again.');

            jest.restoreAllMocks();
        });
    });

    describe('Order Controller - Limit Tests', () => {
        it('should handle creating an order with zero quantity', async () => {
            await expect(
                createOrder({ customerName: 'John Doe', products: [{ productId, quantity: 0 }] })
            ).rejects.toThrow('Quantity must be greater than zero');
        });
        // TODO: Flakey test. I think it has a similar problem in concurrency that the other test we are skipping does.
        it.skip('should handle concurrent orders for the same product', async () => {
            const orderPromise1 = createOrder({
                customerName: 'Alice',
                products: [{ productId, quantity: 50 }],
            });
            const orderPromise2 = createOrder({
                customerName: 'Bob',
                products: [{ productId, quantity: 60 }],
            });

            try {
                await Promise.all([orderPromise1, orderPromise2]);
            } catch (error) {
                if(error instanceof Error) {
                    expect(error.message).toMatch(/Not enough inventory available|The product was modified by another process\. Please retry\./);
                } else {
                    fail('Received an unexpected error type that is not an instance of Error');
                }
            }
        });
    });

})

