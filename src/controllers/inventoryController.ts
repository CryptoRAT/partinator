import Product from '@models/productModel';
import {inventoryLogger as logger } from "@loggers/loggers.ts";

export const updateInventory = async (productId: number, inventory: number): Promise<Product> => {
    if (inventory < 0) {
        throw new Error('Inventory cannot be negative');
    }
    if(inventory > Number.MAX_SAFE_INTEGER){
        throw new Error('Inventory value exceeds safe integer limits');
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
