import request from 'supertest';
import app from '../../app';
import { Product } from '@models/index';
import sequelize from '@db/sequelize';
import {expect} from "@jest/globals";

let productId: number;

beforeAll(async () => {
    await sequelize.sync({ force: true });
    const product = await Product.create({
        name: 'Hex Cap Screw',
        category: 'Fastener',
        material: 'Steel',
        threadSize: 'M10-1.5',
        finish: 'Plain',
        quantity: 10,
        price: 0.75,
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
        expect(response.body.Products).toBeDefined();
        expect(response.body.Products.length).toBeGreaterThan(0);
        expect(response.body.Products[0].id).toBe(productId);
        expect(response.body.Products[0].quantity).toBe(10);
        const product = await Product.findByPk(productId);
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

    it('should return an error if no products are provided', async () => {
        const response = await request(app)
            .post('/api/orders')
            .send({
                customerName: 'John Doe',
                products: [],
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Quantity must be greater than zero');
    });

    it('should return an error if products is not provided', async () => {
        const response = await request(app)
            .post('/api/orders')
            .send({
                customerName: 'John Doe',
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Quantity must be greater than zero');
    });

    it('should return an internal server error if an unexpected error occurs', async () => {
        jest.spyOn(Product, 'findByPk').mockImplementation(() => {
            throw new Error('Unexpected error');
        });

        const response = await request(app)
            .post('/api/orders')
            .send({
                customerName: 'Jane Doe',
                products: [{ productId, quantity: 5 }],
            });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Internal server error');

        jest.restoreAllMocks();
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

    it('should return an error when creating an order with negative quantity', async () => {
        const response = await request(app)
            .post('/api/orders')
            .send({
                customerName: 'John Doe',
                products: [{ productId, quantity: -5 }],
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Quantity must be greater than zero');
    });

    it.skip('should handle concurrent orders for the same product when there is not enough inventory', async () => {
        const orderPromise1 = request(app).post('/api/orders').send({
            customerName: 'Alice',
            products: [{ productId, quantity: 60 }],
        });
        const orderPromise2 = request(app).post('/api/orders').send({
            customerName: 'Bob',
            products: [{ productId, quantity: 70 }],
        });

        const responses = await Promise.allSettled([orderPromise1, orderPromise2]);

        // Filtering the responses to see which succeeded and which failed
        const fulfilled = responses.filter(r => r.status === 'fulfilled');
        const rejected = responses.filter(r => r.status === 'rejected');

        expect(fulfilled.length).toBe(1);
        expect(rejected.length).toBe(1);

        const successfulResponse = fulfilled[0].status === 'fulfilled' ? fulfilled[0].value : null;
        const failedResponse = rejected[0].status === 'rejected' ? rejected[0].reason.response : null;

        if (successfulResponse) {
            expect(successfulResponse.status).toBe(201);
            expect(successfulResponse.body.customerName).toMatch(/Alice|Bob/);
            expect(successfulResponse.body.Products[0].productId).toBe(productId);
            expect(successfulResponse.body.Products[0].quantity).toBe(50);
        }

        if (failedResponse) {
            expect(failedResponse.status).toBe(400);
            expect(failedResponse.body.error).toBe('Not enough inventory available');
        }
    });
});
