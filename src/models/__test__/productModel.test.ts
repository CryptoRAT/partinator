import ProductModel from '@models/productModel.ts';
import sequelize from '@db/memory';

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('ProductModel Model', () => {
    it('should create a product', async () => {
        const product = await ProductModel.create({
            name: 'Hex Cap Screw',
            category: 'Fastener',
            material: 'Steel',
            threadSize: 'M10-1.5',
            finish: 'Plain',
            quantity: 100,
            price: 0.75,
            inventory: 50,
        });

        expect(product.getDataValue('id')).toBeDefined();
        expect(product.getDataValue('name')).toBe('Hex Cap Screw');
        expect(product.getDataValue('inventory')).toBe(50);
    });
    });

    it('should read a product by primary key', async () => {
        const createdProduct = await ProductModel.create({
            name: 'Wood Screw',
            category: 'Fastener',
            material: 'Wood',
            threadSize: 'M5-0.8',
            finish: 'Polished',
            quantity: 50,
            price: 0.5,
            inventory: 30,
        });

        const product = await ProductModel.findByPk(createdProduct.getDataValue('id'));
        expect(product).not.toBeNull();
        expect(product?.getDataValue('name')).toBe('Wood Screw');
        expect(product?.getDataValue('inventory')).toBe(30);
    });

    it('should update a product', async () => {
        const product = await ProductModel.create({
            name: 'Bolt',
            category: 'Fastener',
            material: 'Alloy',
            threadSize: 'M8-1.25',
            finish: 'Zinc',
            quantity: 200,
            price: 1.0,
            inventory: 30,
        });

        await product.update({
            quantity: 300,
            price: 1.25,
            inventory: 60,
        });

        const updatedProduct = await ProductModel.findByPk(product.getDataValue('id'));
        expect(updatedProduct?.getDataValue('quantity')).toBe(300);
        expect(updatedProduct?.getDataValue('price')).toBe(1.25);
        expect(updatedProduct?.getDataValue('inventory')).toBe(60);
    });

    it('should soft delete a product', async () => {
        const product = await ProductModel.create({
            name: 'Nail',
            category: 'Fastener',
            material: 'Steel',
            threadSize: 'N/A',
            finish: 'Galvanized',
            quantity: 1000,
            price: 0.05,
        });

        const productId = product.getDataValue('id');
        await product.destroy();

        const deletedProduct = await ProductModel.findByPk(productId, { paranoid: false });
        expect(deletedProduct).not.toBeNull();
        expect(deletedProduct?.getDataValue('deletedAt')).toBeDefined();

        // Verify that the product is not returned in a standard findAll query
        const products = await ProductModel.findAll();
        expect(products.find(p => p.getDataValue('id') === productId)).toBeUndefined();
    });

    it('should find all products excluding soft deleted', async () => {
        await ProductModel.create({
            name: 'Anchor Bolt',
            category: 'Fastener',
            material: 'Stainless Steel',
            threadSize: 'M12-1.75',
            finish: 'Polished',
            quantity: 120,
            price: 1.5,
        });

        await ProductModel.create({
            name: 'Hex Nut',
            category: 'Fastener',
            material: 'Brass',
            threadSize: 'M12',
            finish: 'Plain',
            quantity: 500,
            price: 0.25,
        });

        // Soft delete a product
        const productToDelete = await ProductModel.create({
            name: 'Washer',
            category: 'Fastener',
            material: 'Steel',
            threadSize: 'M6',
            finish: 'Plain',
            quantity: 300,
            price: 0.1,
        });
        await productToDelete.destroy();

        // Find all products excluding soft deleted
        const products = await ProductModel.findAll();
        expect(products.length).toBeGreaterThanOrEqual(2);
        expect(products.find(p => p.getDataValue('name') === 'Washer')).toBeFalsy();
    });

    it('should find all products including soft deleted when paranoid is false', async () => {
        // Find all products including soft deleted
        const allProducts = await ProductModel.findAll({ paranoid: false });
        expect(allProducts.length).toBeGreaterThanOrEqual(3);
        const softDeletedProduct = allProducts.find(p => p.getDataValue('name') === 'Washer');
        expect(softDeletedProduct).not.toBeNull();
        expect(softDeletedProduct?.getDataValue('deletedAt')).not.toBeNull();
    });
});


