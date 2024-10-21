import request from 'supertest';
import app from '../../app';
import ProductModel from '@models/productModel.ts';
import sequelize from '@db/memory';
import { inventoryLogger } from '@loggers/loggers';

// Global logger mock setup
let originalError: typeof inventoryLogger.error;
let originalInfo: typeof inventoryLogger.info;

beforeAll(async () => {
    originalError = inventoryLogger.error;
    inventoryLogger.error = jest.fn();
    originalInfo = inventoryLogger.info;
    inventoryLogger.info = jest.fn();
    await sequelize.sync({ force: true });
    await ProductModel.bulkCreate([
        {
            name: 'Hex Cap Screw',
            category: 'Fastener',
            material: 'Steel',
            threadSize: 'M10-1.5',
            finish: 'Plain',
            quantity: 100,
            price: 0.75,
        },
        {
            name: 'Wood Screw',
            category: 'Fastener',
            material: 'Stainless Steel',
            threadSize: 'M5-0.8',
            finish: 'Polished',
            quantity: 200,
            price: 0.5,
        },
    ]);
});

afterAll(async () => {
    // Restore the original logger methods
    inventoryLogger.error = originalError;
    inventoryLogger.info = originalInfo;

    await sequelize.close(); // Close the database connection after tests
});

// Inventory Management Tests
describe('Inventory Management', () => {
    let productId: number;

    beforeAll(async () => {
        // Create a product to work with inventory
        const product = await ProductModel.create({
            name: 'Hex Cap Screw',
            category: 'Fasteners',
            price: 0.75,
            inventory: 100,
        });
        productId = product.id;
    });

    describe('PUT /inventory/:id', () => {
        it('should update inventory level successfully', async () => {
            const response = await request(app)
                .put(`/inventory/${productId}`)
                .send({ quantity: 50 });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Inventory updated successfully');

            const updatedProduct = await ProductModel.findByPk(productId);
            expect(updatedProduct?.inventory).toBe(150);
        });

        it('should return an error when updating inventory with invalid data', async () => {
            const response = await request(app)
                .put(`/inventory/${productId}`)
                .send({ quantity: -200 });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid inventory update request');
        });
    });


});

