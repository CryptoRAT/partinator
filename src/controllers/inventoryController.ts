import { Product } from '@models/index';
import {inventoryLogger as logger } from "@loggers/loggers.ts";

const MAX_DB_INTEGER_SIZE = 2147483647;
export const updateInventory = async (productId: number, inventory: number): Promise<Product> => {
    if (inventory < 0) {
        throw new Error('Inventory cannot be negative');
    }
    if(inventory > MAX_DB_INTEGER_SIZE){
        throw new Error('Inventory value exceeds maximum allowed for an INTEGER in the db');
    }
    const product = await Product.findByPk(productId);
    if (!product) {
        logger.error('Product not found');
        throw new Error('Product not found');
    }

    await product.update({ inventory });

    // Re-fetch the updated product to ensure consistency
    const updatedProduct = await Product.findByPk(productId);
    if (!updatedProduct) {
        logger.error('Product not found after update');
        throw new Error('Product not found after update');
    }
    return updatedProduct;
};

export const getInventory = async (productId: number) => {

    const product = await Product.findByPk(productId);
    if (!product) {
        logger.error('Product not found');
        throw new Error('Product not found');
    }

    return product.getDataValue('inventory');
};

export const getInventories = async () => {
    try {
        const products = await Product.findAll({
            attributes: ['id', 'name', 'inventory'],
        });
        return products.map(product => product.get({ plain: true }));
    } catch (error) {
        logger.error('Error fetching inventories:', error);
        throw new Error('Error fetching inventories');
    }
};
