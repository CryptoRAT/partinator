import ProductModel from '@models/productModel';
import OrderModel from '@models/orderModel';
import sequelize from '@db/memory';
import { createOrder } from '@controllers/orderController';

let productId: number;

beforeAll(async () => {
    await sequelize.sync({ force: true });
    const product = await ProductModel.create({
        name: 'Hex Cap Screw',
        category: 'Fastener',
        material: 'Steel',
        inventory: 100,
    });
    productId = product.getDataValue('id');
});

afterAll(async () => {
    await sequelize.close();
});

describe('Order Controller - Happy Path Tests', () => {
    it('should create an order successfully and update inventory', async () => {
        const order = await createOrder({
            customerName: 'John Doe',
            products: [{ productId, quantity: 10 }],
        });

        expect(order).toBeDefined();
        expect(order.customerName).toBe('John Doe');

        const product = await ProductModel.findByPk(productId);
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
});

describe('Order Controller - Limit Tests', () => {
    it('should handle creating an order with zero quantity', async () => {
        await expect(
            createOrder({ customerName: 'John Doe', products: [{ productId, quantity: 0 }] })
        ).rejects.toThrow('Quantity must be greater than zero');
    });

    it('should handle concurrent orders for the same product', async () => {
        const orderPromise1 = createOrder({
            customerName: 'Alice',
            products: [{ productId, quantity: 50 }],
        });
        const orderPromise2 = createOrder({
            customerName: 'Bob',
            products: [{ productId, quantity: 60 }],
        });

        await expect(Promise.all([orderPromise1, orderPromise2])).rejects.toThrow('Not enough inventory available');
    });
});
