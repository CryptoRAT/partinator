import { DataTypes } from 'sequelize';
import sequelize from '@db/memory';
import OrderModel from '@models/orderModel';
import ProductModel from '@models/productModel';

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Order Model', () => {
    it('should create an Order with correct fields', async () => {
        const order = await OrderModel.create({
            customerName: 'John Doe',
            status: 'pending',
        });

        expect(order).toBeDefined();
        expect(order.customerName).toBe('John Doe');
        expect(order.status).toBe('pending');
    });

    it('should associate orders with products', async () => {
        const product = await ProductModel.create({
            name: 'Hex Cap Screw',
            category: 'Fastener',
            material: 'Steel',
            inventory: 100,
        });

        const order = await OrderModel.create({
            customerName: 'Jane Doe',
            status: 'pending',
        });

        await order.addProduct(product, { through: { quantity: 5 } });

        const products = await order.getProducts();
        expect(products.length).toBe(1);
        expect(products[0].name).toBe('Hex Cap Screw');
    });

    it('should require customerName field', async () => {
        await expect(OrderModel.create({ status: 'pending' })).rejects.toThrow();
    });

    it('should require a valid status', async () => {
        await expect(
            OrderModel.create({ customerName: 'Invalid Status Test', status: 'invalid' })
        ).rejects.toThrow();
    });
});
