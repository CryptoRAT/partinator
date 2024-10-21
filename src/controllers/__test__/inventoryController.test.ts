import ProductModel from '@models/productModel.ts';
import sequelize from '@db/memory';
import { getInventory } from '@controllers/productController';

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
