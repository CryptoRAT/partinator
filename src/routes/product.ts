import express, { Request, Response } from 'express';
import { getProducts } from '../controllers/productController';
import { productsLogger } from '../loggers/loggers';
import { query, validationResult } from 'express-validator';

const router = express.Router();

router.get(
    '/api/products',
    [
        query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
        query('pageSize').optional().isInt({ min: 1 }).withMessage('Page size must be a positive integer'),
        query('category').optional().isString().not().isNumeric().withMessage('Category must be a non-numeric string'),
        query('material').optional().isString().not().isNumeric().withMessage('Material must be a non-numeric string'),
        query('threadSize').optional().isString().not().isNumeric().withMessage('Thread size must be a non-numeric string'),
        query('finish').optional().isString().not().isNumeric().withMessage('Finish must be a non-numeric string'),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { category, material, threadSize, finish, page = '1', pageSize = '10' } = req.query;

            const filters: any = {};
            if (category) filters.category = category;
            if (material) filters.material = material;
            if (threadSize) filters.threadSize = threadSize;
            if (finish) filters.finish = finish;

            const products = await getProducts(filters, Number(page), Number(pageSize));

            productsLogger.info('Products fetched successfully', { filters, page, pageSize });
            res.status(200).json(products);
        } catch (error) {
            productsLogger.error('Error fetching products:', { error });
            res.status(500).send('An error occurred while fetching products');
        }
    }
);

export default router;
