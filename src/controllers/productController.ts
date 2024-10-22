import { Product } from '@models/index';
import { productsLogger as logger } from "@loggers/loggers.ts";

export const getProducts = async (filters: any, page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    try {
        const products = await Product.findAll({
            where: filters,
            offset,
            limit,
        });

        return products;
    } catch (error) {
        // Enhanced logging for first failure data capture
        const errorDetails: any = {
            filters,
            page,
            pageSize,
            offset,
            limit,
            timestamp: new Date().toISOString(),
        };

        if (error instanceof Error) {
            errorDetails.errorName = error.name;
            errorDetails.errorMessage = error.message;
            errorDetails.stackTrace = error.stack;
        } else {
            errorDetails.errorMessage = 'Unknown error occurred';
        }

        logger.error('Error fetching products:', errorDetails);
        throw new Error(errorDetails.errorMessage || 'Unknown error occurred');
    }
};
