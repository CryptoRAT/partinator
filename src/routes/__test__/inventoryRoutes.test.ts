import request from 'supertest';
import app from '../../app';
import { Product } from '@models/index';
import sequelize from '@db/sequelize';
import { inventoryLogger } from '@loggers/loggers';

// Global logger mock setup
let originalError: typeof inventoryLogger.error;
let originalInfo: typeof inventoryLogger.info;

let productId: number;

beforeAll(async () => {
    originalError = inventoryLogger.error;
    inventoryLogger.error = jest.fn();
    originalInfo = inventoryLogger.info;
    inventoryLogger.info = jest.fn();
    await sequelize.sync({ force: true });

    // Create products and assign productId for the tests
    const products = await Product.create({
        name: 'Hex Cap Screw',
        category: 'Fastener',
        material: 'Steel',
        threadSize: 'M10-1.5',
        finish: 'Plain',
        quantity: 100,
        price: 0.75,
        inventory: 64,
    });

    productId = products.getDataValue('id');
});

afterAll(async () => {
    // Restore the original logger methods
    inventoryLogger.error = originalError;
    inventoryLogger.info = originalInfo;

    await sequelize.close(); // Close the database connection after tests
});

// Inventory Management Tests
describe('Inventory Management Routes', () => {
    // Happy Path Tests
    describe('Happy Path Tests', () => {
        describe('PUT /inventory/:productId', () => {
            it('should update inventory level successfully', async () => {
                const response = await request(app)
                    .put(`/api/inventory/${productId}`)
                    .send({ inventory: 50 });

                expect(response.status).toBe(200);
                expect(response.body.inventory).toBe(50);
                const updatedProduct = await Product.findByPk(productId);
                expect(updatedProduct?.getDataValue('inventory')).toBe(50);
            });
        });

        describe('GET /inventory/:productId', () => {
            it('should return the correct inventory level for a product', async () => {
                const response = await request(app).get(`/api/inventory/${productId}`);

                expect(response.status).toBe(200);
                expect(response.body.inventory).toBe(50); // The inventory was updated to 50 in the previous test
            });
        });
    });

    // Branch Tests
    describe('Branch Tests', () => {
        describe('PUT /inventory/:productId', () => {
            it('should return an error when productId is invalid', async () => {
                const response = await request(app)
                    .put('/api/inventory/invalidProductId')
                    .send({ inventory: 50 });

                expect(response.status).toBe(400);
                expect(response.body.error).toBe('Invalid productId. It must be a number.');
            });

            it('should return an error if the product does not exist', async () => {
                const nonExistentProductId = 9999;
                const response = await request(app)
                    .put(`/api/inventory/${nonExistentProductId}`)
                    .send({ inventory: 50 });

                expect(response.status).toBe(404);
                expect(response.body.error).toBe('Product not found');
            });
        });

        describe('GET /inventory/:productId', () => {
            it('should return an error if the product does not exist', async () => {
                const response = await request(app).get('/api/inventory/9999'); // Non-existent productId

                expect(response.status).toBe(404);
                expect(response.body.error).toBe('Product not found');
            });

            it('should return an error when productId is invalid', async () => {
                const response = await request(app).get('/api/inventory/invalidProductId'); // Invalid productId

                expect(response.status).toBe(400);
                expect(response.body.error).toBe('Invalid productId. It must be a number.');
            });
        });
    });

    // Limit Tests
    describe('Limit Tests', () => {
        describe('PUT /inventory/:productId', () => {
            it('should return an error when updating inventory with negative value', async () => {
                const response = await request(app)
                    .put(`/api/inventory/${productId}`)
                    .send({ inventory: -200 });

                expect(response.status).toBe(400);
                expect(response.body.error).toBe('Inventory cannot be negative');
            });

            it('should return an error when updating inventory to a value larger than MAX_SAFE_INTEGER', async () => {
                const largerThanMaxSafeInteger = Number.MAX_SAFE_INTEGER + 1;
                const response = await request(app)
                    .put(`/api/inventory/${productId}`)
                    .send({ inventory: largerThanMaxSafeInteger });

                expect(response.status).toBe(400);
                expect(response.body.error).toBe('Inventory value exceeds safe integer limits');
            });

            it('should return an error when updating inventory with an extremely large value', async () => {
                const extremelyLargeValue = 1e20;
                const response = await request(app)
                    .put(`/api/inventory/${productId}`)
                    .send({ inventory: extremelyLargeValue });

                expect(response.status).toBe(400);
                expect(response.body.error).toBe('Inventory value exceeds safe integer limits');
            });

            it('should set inventory level to zero successfully', async () => {
                const response = await request(app)
                    .put(`/api/inventory/${productId}`)
                    .send({ inventory: 0 });

                expect(response.status).toBe(200);
                expect(response.body.inventory).toBe(0);
                const updatedProduct = await Product.findByPk(productId);
                expect(updatedProduct?.getDataValue('inventory')).toBe(0);
            });

            it('should update inventory to a large positive value successfully', async () => {
                const largeValue = 100000;
                const response = await request(app)
                    .put(`/api/inventory/${productId}`)
                    .send({ inventory: largeValue });

                expect(response.status).toBe(200);
                expect(response.body.inventory).toBe(largeValue);
                const updatedProduct = await Product.findByPk(productId);
                expect(updatedProduct?.getDataValue('inventory')).toBe(largeValue);
            });
        });
    });
});
