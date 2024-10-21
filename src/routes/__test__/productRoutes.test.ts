import request from 'supertest';
import app from '../../app';
import ProductModel from '@models/productModel.ts';
import sequelize from '@db/memory';
import { productsLogger } from '@loggers/loggers';

// Global logger mock setup
let originalError: typeof productsLogger.error;
let originalInfo: typeof productsLogger.info;

beforeAll(async () => {
    originalError = productsLogger.error;
    productsLogger.error = jest.fn();
    originalInfo = productsLogger.info;
    productsLogger.info = jest.fn();
    await sequelize.sync({ force: true }); // Ensure the database is properly synced
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
    productsLogger.error = originalError;
    productsLogger.info = originalInfo;

    await sequelize.close(); // Close the database connection after tests
});

describe('GET /api/products', () => {

    it('should handle internal server errors gracefully', async () => {
        jest.spyOn(ProductModel, 'findAll').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app).get('/api/products');
        expect(response.status).toBe(500);
        expect(response.text).toBe('An error occurred while fetching products');

        expect(productsLogger.error).toHaveBeenCalledWith('Error fetching products:', {
            error: expect.any(Error)
        });

        (ProductModel.findAll as jest.Mock).mockRestore();
    });

    it('should return a 400 error if page is not a positive integer', async () => {
        const response = await request(app).get('/api/products?page=-1');
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Page must be a positive integer');
    });

    it('should return a 400 error if pageSize is not a positive integer', async () => {
        const response = await request(app).get('/api/products?pageSize=-5');
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Page size must be a positive integer');
    });

    it('should return a 400 error if an invalid query parameter is provided', async () => {
        const response = await request(app).get('/api/products?category=Fastener&page=abc');
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Page must be a positive integer');
    });

    it('should successfully return products with valid filters and pagination', async () => {
        const response = await request(app).get('/api/products?category=Fastener&page=1&pageSize=2');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        expect(productsLogger.info).toHaveBeenCalledWith('Products fetched successfully', expect.any(Object));
    });
});
describe('GET /api/products - Validation Tests', () => {
    it('should return a 400 error when page is negative', async () => {
        const response = await request(app).get('/api/products?page=-1');
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Page must be a positive integer');
    });

    it('should return a 400 error when page is not a number', async () => {
        const response = await request(app).get('/api/products?page=invalid');
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Page must be a positive integer');
    });

    it('should return a 400 error when pageSize is not a positive integer', async () => {
        const response = await request(app).get('/api/products?pageSize=-5');
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Page size must be a positive integer');
    });

    it('should return a 400 error when pageSize is not a number', async () => {
        const response = await request(app).get('/api/products?pageSize=invalid');
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Page size must be a positive integer');
    });

    it('should return a 400 error when category is not a string', async () => {
        const response = await request(app).get('/api/products?category=123');
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Category must be a non-numeric string');
    });

    it('should return a 400 error when material is not a string', async () => {
        const response = await request(app).get('/api/products?material=456');
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Material must be a non-numeric string');
    });

    it('should return a 400 error when threadSize is not a string', async () => {
        const response = await request(app).get('/api/products?threadSize=789');
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Thread size must be a non-numeric string');
    });

    it('should return a 400 error when finish is not a string', async () => {
        const response = await request(app).get('/api/products?finish=101112');
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Finish must be a non-numeric string');
    });

    it('should return a 400 error when both category and material are invalid', async () => {
        const response = await request(app).get('/api/products?category=123&material=456');
        expect(response.status).toBe(400);
        expect(response.body.errors.length).toBeGreaterThanOrEqual(2);
        expect(response.body.errors[0].msg).toBe('Category must be a non-numeric string');
        expect(response.body.errors[1].msg).toBe('Material must be a non-numeric string');
    });
});

describe('GET /api/products - Filter Application Tests', () => {
    it('should fetch products without any filters applied', async () => {
        const response = await request(app).get('/api/products');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        expect(productsLogger.info).toHaveBeenCalledWith('Products fetched successfully', expect.any(Object));
    });

    it('should fetch products with only category filter applied', async () => {
        const response = await request(app).get('/api/products?category=Fastener');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0].category).toBe('Fastener');
    });

    it('should fetch products with only material filter applied', async () => {
        const response = await request(app).get('/api/products?material=Steel');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0].material).toBe('Steel');
    });

    it('should fetch products with all filters applied', async () => {
        const response = await request(app).get('/api/products?category=Fastener&material=Steel&threadSize=M10-1.5&finish=Plain');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0].category).toBe('Fastener');
        expect(response.body[0].material).toBe('Steel');
        expect(response.body[0].threadSize).toBe('M10-1.5');
        expect(response.body[0].finish).toBe('Plain');
    });
});
