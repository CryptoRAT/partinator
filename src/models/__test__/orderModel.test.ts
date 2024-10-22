import sequelize from '@db/sequelize';
import { Order, Product } from '@models/index';


beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Order Model', () => {
    it('should create an order with correct fields', async () => {
        try {
            const order = await Order.create({
                customerName: 'John Doe',
                status: 'pending',
            });

            expect(order).toBeDefined();
            expect(order.getDataValue('customerName')).toBe('John Doe');
            expect(order.getDataValue('status')).toBe('pending');
        } catch (error) {
            console.error('Order creation error:', error);
            throw error;
        }
    });

    it('should associate orders with products', async () => {
        const product = await Product.create({
            name: 'Hex Cap Screw',
            category: 'Fastener',
            material: 'Steel',
            threadSize: 'M10-1.5',
            finish: 'Plain',
            quantity: 100,
            price: 0.75,
            inventory: 50,
        });

        const order = await Order.create({
            customerName: 'Jane Doe',
            status: 'pending',
        });

        await order.addProduct(product, { through: { quantity: 5 } });

        const products = await order.getProducts();
        expect(products.length).toBe(1);
        expect(products[0].getDataValue('name')).toBe('Hex Cap Screw');
    });

    it('should require customerName field', async () => {
        await expect(Order.create({ status: 'pending' })).rejects.toThrow();
    });

    it('should require a valid status', async () => {
        await expect(
            Order.create({ customerName: 'Invalid Status Test', status: 'invalid' })
        ).rejects.toThrow();
    });
});
