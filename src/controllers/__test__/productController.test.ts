import ProductModel from '@models/productModel.ts';
import sequelize from '@db/memory';
import { getProducts, getInventory } from '@controllers/productController';

beforeAll(async () => {
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
    await sequelize.close();
});

describe('ProductModel Controller', () => {
    it('should fetch products with no filters', async () => {
        const products = await getProducts({}, 1, 10);
        expect(products.length).toBeGreaterThan(0);
    });

    it('should fetch products filtered by category', async () => {
        const products = await getProducts({ category: 'Fastener' }, 1, 10);
        expect(products.length).toBeGreaterThan(0);
        expect(products[0].getDataValue('category')).toBe('Fastener');
    });

    it('should fetch products filtered by material', async () => {
        const products = await getProducts({ material: 'Steel' }, 1, 10);
        expect(products.length).toBeGreaterThan(0);
        expect(products[0].getDataValue('material')).toBe('Steel');
    });

    it('should fetch products filtered by thread size', async () => {
        const products = await getProducts({ threadSize: 'M10-1.5' }, 1, 10);
        expect(products.length).toBeGreaterThan(0);
        expect(products[0].getDataValue('threadSize')).toBe('M10-1.5');
    });

    it('should fetch products filtered by finish', async () => {
        const products = await getProducts({ finish: 'Plain' }, 1, 10);
        expect(products.length).toBeGreaterThan(0);
        expect(products[0].getDataValue('finish')).toBe('Plain');
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
        expect(productsPage1[0].getDataValue('id')).not.toBe(productsPage2[0].getDataValue('id'));
    });

    it('should throw an error when there is an internal server error', async () => {
        jest.spyOn(ProductModel, 'findAll').mockImplementation(() => {
            throw new Error('Database error');
        });

        await expect(getProducts({}, 1, 10)).rejects.toThrow('Database error');

        (ProductModel.findAll as jest.Mock).mockRestore();
    });
});

// Inventory Management Controller Tests
describe('Inventory Management Controller', () => {
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

    describe('updateInventory', () => {
        it('should update inventory level successfully', async () => {
            const updatedProduct = await updateInventory(productId, 50);
            expect(updatedProduct.inventory).toBe(150);
        });

        it('should throw an error when updating inventory with invalid data', async () => {
            await expect(updateInventory(productId, -200)).rejects.toThrow('Invalid inventory update request');
        });
    });

    describe('getInventory', () => {
        it('should return the correct inventory level for a product', async () => {
            const inventory = await getInventory(productId);
            expect(inventory).toBe(150);
        });

        it('should throw an error if the product does not exist', async () => {
            await expect(getInventory(9999)).rejects.toThrow('ProductModel not found');
        });
    });
});
