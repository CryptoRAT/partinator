import Product from '@models/product';
import sequelize from '@db/memory';

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Product Model', () => {
    it('should create a product', async () => {
        const product = await Product.create({
            name: 'Hex Cap Screw',
            category: 'Fastener',
            material: 'Steel',
            threadSize: 'M10-1.5',
            finish: 'Plain',
            quantity: 100,
            price: 0.75,
        });

        expect(product.id).toBeDefined();
        expect(product.name).toBe('Hex Cap Screw');
    });

    it('should read a product by primary key', async () => {
        const createdProduct = await Product.create({
            name: 'Wood Screw',
            category: 'Fastener',
            material: 'Wood',
            threadSize: 'M5-0.8',
            finish: 'Polished',
            quantity: 50,
            price: 0.5,
        });

        const product = await Product.findByPk(createdProduct.id);
        expect(product).not.toBeNull();
        expect(product?.name).toBe('Wood Screw');
    });

    it('should update a product', async () => {
        const product = await Product.create({
            name: 'Bolt',
            category: 'Fastener',
            material: 'Alloy',
            threadSize: 'M8-1.25',
            finish: 'Zinc',
            quantity: 200,
            price: 1.0,
        });

        await product.update({
            quantity: 300,
            price: 1.25,
        });

        expect(product.quantity).toBe(300);
        expect(product.price).toBe(1.25);
    });

    it('should delete a product', async () => {
        const product = await Product.create({
            name: 'Nail',
            category: 'Fastener',
            material: 'Steel',
            threadSize: 'N/A',
            finish: 'Galvanized',
            quantity: 1000,
            price: 0.05,
        });

        const productId = product.id;
        await product.destroy();

        const deletedProduct = await Product.findByPk(productId);
        expect(deletedProduct).toBeNull();
    });

    it('should find all products', async () => {
        await Product.create({
            name: 'Anchor Bolt',
            category: 'Fastener',
            material: 'Stainless Steel',
            threadSize: 'M12-1.75',
            finish: 'Polished',
            quantity: 120,
            price: 1.5,
        });

        await Product.create({
            name: 'Hex Nut',
            category: 'Fastener',
            material: 'Brass',
            threadSize: 'M12',
            finish: 'Plain',
            quantity: 500,
            price: 0.25,
        });

        const products = await Product.findAll();
        expect(products.length).toBeGreaterThanOrEqual(2);
    });
});
