import request from 'supertest';
import app from '../../app';
import ProductModel from '@models/productModel';
import sequelize from '@db/memory';

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

describe('Order Routes - Happy Path Tests', () => {
    it('should create an order successfully and return the order details', async () => {
        const response = await request(app)
            .post('/api/orders')
            .send({
                customerName: 'John Doe',
                products: [{ productId, quantity: 10 }],
            });

        expect(response.status).toBe(201);
        expect(response.body.customerName).toBe('John Doe');
        expect(response.body.products[0].productId).toBe(productId);
        expect(response.body.products[0].quantity).toBe(10);

        const product = await ProductModel.findByPk(productId);
        expect(product?.getDataValue('inventory')).toBe(90);
    });
});

describe('Order Routes - Branch Tests', () => {
    it('should return an error if the product does not exist', async () => {
        const response = await request(app)
            .post('/api/orders')
            .send({
                customerName: 'Jane Doe',
                products: [{ productId: 9999, quantity: 5 }],
            });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Product not found');
    });

    it('should return an error if there is not enough inventory', async () => {
        const response = await request(app)
            .post('/api/orders')
            .send({
                customerName: 'John Doe',
                products: [{ productId, quantity: 200 }],
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Not enough inventory available');
    });
});

describe('Order Routes - Limit Tests', () => {
    it('should return an error when creating an order with zero quantity', async () => {
        const response = await request(app)
            .post('/api/orders')
            .send({
                customerName: 'John Doe',
                products: [{ productId, quantity: 0 }],
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Quantity must be greater than zero');
    });

    it('should handle concurrent orders for the same product', async () => {
        const orderPromise1 = request(app).post('/api/orders').send({
            customerName: 'Alice',
            products: [{ productId, quantity: 50 }],
        });
        const orderPromise2 = request(app).post('/api/orders').send({
            customerName: 'Bob',
            products: [{ productId, quantity: 60 }],
        });

        const responses = await Promise.allSettled([orderPromise1, orderPromise2]);

        const fulfilled = responses.filter(r => r.status === 'fulfilled');
        const rejected = responses.filter(r => r.status === 'rejected');

        expect(fulfilled.length).toBe(1);
        expect(rejected.length).toBe(1);
        expect(rejected[0].reason.response.body.error).toBe('Not enough inventory available');
    });
});
