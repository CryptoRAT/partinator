import Product from '@models/product';
import sequelize from '@db/memory';
import { getProducts } from '@controllers/productController';

beforeAll(async () => {
    await sequelize.sync({ force: true });
    await Product.bulkCreate([
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
    await sequelize.close();
});

describe('Product Controller', () => {
    it('should fetch products with no filters', async () => {
        const products = await getProducts({}, 1, 10);
        expect(products.length).toBeGreaterThan(0);
    });

    it('should fetch products filtered by category', async () => {
        const products = await getProducts({ category: 'Fastener' }, 1, 10);
        expect(products.length).toBeGreaterThan(0);
        expect(products[0].category).toBe('Fastener');
    });

    it('should fetch products filtered by material', async () => {
        const products = await getProducts({ material: 'Steel' }, 1, 10);
        expect(products.length).toBeGreaterThan(0);
        expect(products[0].material).toBe('Steel');
    });

    it('should fetch products filtered by thread size', async () => {
        const products = await getProducts({ threadSize: 'M10-1.5' }, 1, 10);
        expect(products.length).toBeGreaterThan(0);
        expect(products[0].threadSize).toBe('M10-1.5');
    });

    it('should fetch products filtered by finish', async () => {
        const products = await getProducts({ finish: 'Plain' }, 1, 10);
        expect(products.length).toBeGreaterThan(0);
        expect(products[0].finish).toBe('Plain');
    });

    it('should return an empty list if no products match the filters', async () => {
        const products = await getProducts({ category: 'NonExistentCategory' }, 1, 10);
        expect(products.length).toBe(0);
    });

    it('should support pagination', async () => {
        const productsPage1 = await getProducts({}, 1, 1);
        expect(productsPage1.length).toBe(1);

        const productsPage2 = await getProducts({}, 2, 1);
        expect(productsPage2.length).toBe(1);
        expect(productsPage1[0].id).not.toBe(productsPage2[0].id);
    });

    it('should throw an error when there is an internal server error', async () => {
        jest.spyOn(Product, 'findAll').mockImplementation(() => {
            throw new Error('Database error');
        });

        await expect(getProducts({}, 1, 10)).rejects.toThrow('Database error');

        (Product.findAll as jest.Mock).mockRestore();
    });
});
