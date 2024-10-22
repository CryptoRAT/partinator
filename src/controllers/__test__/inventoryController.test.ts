import { Product } from '@models/index';
import sequelize from '@db/sequelize';
import { getInventory, updateInventory } from '@controllers/inventoryController';

let productId: number; // Define productId at the top scope

beforeAll(async () => {
    await sequelize.sync({ force: true });
    const products = await Product.bulkCreate([
        {
            name: 'Hex Cap Screw',
            category: 'Fastener',
            material: 'Steel',
            threadSize: 'M10-1.5',
            finish: 'Plain',
            quantity: 100,
            price: 0.75,
            inventory: 25,
        },
        {
            name: 'Wood Screw',
            category: 'Fastener',
            material: 'Stainless Steel',
            threadSize: 'M5-0.8',
            finish: 'Polished',
            quantity: 200,
            price: 0.5,
            inventory: 25,
        },
    ]);
    productId = products[0].getDataValue('id'); // Assign productId to the first product created
});

afterAll(async () => {
    await sequelize.close();
});


describe('Inventory Management Controller', () => {
    describe('updateInventory - Happy Path Tests', () => {
        it('should update inventory level successfully', async () => {
            const updatedProduct = await updateInventory(productId, 50);
            expect(updatedProduct.getDataValue('inventory')).toBe(50);
        });
    });

    describe('getInventory', () => {
        it('should return the correct inventory level for a product', async () => {
            const inventory = await getInventory(productId);
            expect(inventory).toBe(50);
        });

        it('should throw an error if the product does not exist', async () => {
            await expect(getInventory(9999)).rejects.toThrow('Product not found');
        });
    });
    describe('updateInventory - Branch Tests', () => {
        it('should throw an error if the product does not exist', async () => {
            const nonExistentProductId = 9999;
            await expect(updateInventory(nonExistentProductId, 50)).rejects.toThrow('Product not found');
        });

        it('should throw an error if the product is not found after the update', async () => {
            // Mocking Product.findByPk to simulate product being deleted after update
            jest.spyOn(Product, 'findByPk')
                .mockResolvedValueOnce({ update: jest.fn() } as any) // First call returns a mock product
                .mockResolvedValueOnce(null); // Second call simulates the product not being found after update

            await expect(updateInventory(productId, 50)).rejects.toThrow('Product not found after update');

            // Restore the original implementation
            jest.restoreAllMocks();
        });
    });
    describe('updateInventory - Limit Tests', () => {
        it('should set inventory level to zero successfully', async () => {
            const updatedProduct = await updateInventory(productId, 0);
            expect(updatedProduct.getDataValue('inventory')).toBe(0);
        });

        it('should update inventory to a large positive value successfully', async () => {
            const largeValue = 100000;
            const updatedProduct = await updateInventory(productId, largeValue);
            expect(updatedProduct.getDataValue('inventory')).toBe(largeValue);
        });

        it('should throw an error when updating inventory with a negative value', async () => {
            await expect(updateInventory(productId, -1)).rejects.toThrow('Inventory cannot be negative');
        });

        it('should throw an error when updating inventory with a large negative value', async () => {
            await expect(updateInventory(productId, -999999)).rejects.toThrow('Inventory cannot be negative');
        });

        it('should handle maximum safe integer value in PostgreSQL as inventory value', async () => {
            const maxSafeInteger = 2147483647;
            const updatedProduct = await updateInventory(productId, maxSafeInteger);
            expect(updatedProduct.getDataValue('inventory')).toBe(maxSafeInteger);
        });
        it('should throw an error when updating inventory to a value larger than MAX_SAFE_INTEGER', async () => {
            const largerThanMaxSafeInteger = Number.MAX_SAFE_INTEGER + 1;
            await expect(updateInventory(productId, largerThanMaxSafeInteger)).rejects.toThrow(
                'Inventory value exceeds maximum allowed for an INTEGER in the db'
            );
        });

        it('should throw an error when updating inventory with an extremely large value', async () => {
            const extremelyLargeValue = 1e20;
            await expect(updateInventory(productId, extremelyLargeValue)).rejects.toThrow(
                'Inventory value exceeds maximum allowed for an INTEGER in the db'
            );
        });
    });
});
