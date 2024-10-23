import express, { Request, Response } from 'express';
import { getProducts } from '@controllers/productController';
import { productsLogger } from '@loggers/loggers';
import { query, validationResult } from 'express-validator';

const router = express.Router();


/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve a list of products
 *     description: Retrieve a list of products with optional filters.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of products per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category (must be a non-numeric string)
 *       - in: query
 *         name: material
 *         schema:
 *           type: string
 *         description: Filter by material (must be a non-numeric string)
 *       - in: query
 *         name: threadSize
 *         schema:
 *           type: string
 *         description: Filter by thread size (must be a non-numeric string)
 *       - in: query
 *         name: finish
 *         schema:
 *           type: string
 *         description: Filter by finish (must be a non-numeric string)
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   category:
 *                     type: string
 *                   material:
 *                     type: string
 *                   threadSize:
 *                     type: string
 *                   finish:
 *                     type: string
 *                   quantity:
 *                     type: integer
 *                   price:
 *                     type: number
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         description: Error message describing what went wrong
 *       500:
 *         description: Internal server error
 */
router.get(
    '/products',
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
            res.setHeader('Content-Range', `products 0-9/${products.length}`);
            res.status(200).json(products);
        } catch (error) {
            productsLogger.error('Error fetching products:', { error });
            res.status(500).send('An error occurred while fetching products');
        }
    }
);

export default router;
