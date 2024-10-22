import { Router } from 'express';
import { createOrder } from '@controllers/orderController';

interface ProductInput {
    productId: number;
    quantity: number;
}

const router = Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     description: Creates a new order with a list of products for a specified customer.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerName:
 *                 type: string
 *                 description: The name of the customer placing the order
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       description: The ID of the product to be ordered
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       description: The quantity of the product to be ordered (must be greater than zero)
 *             required:
 *               - customerName
 *               - products
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 customerName:
 *                   type: string
 *                 Products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       productId:
 *                         type: integer
 *                       quantity:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Bad request - Quantity must be greater than zero
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Quantity must be greater than zero"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post('/api/orders', async (req, res) => {
    const { customerName, products }: { customerName: string; products: ProductInput[] } = req.body;

    // Check if products array is valid and contains at least one product with quantity > 0
    if (!products || products.length === 0 || products.some(({ quantity }) => quantity <= 0)) {
        return res.status(400).json({ error: 'Quantity must be greater than zero' });
    }

    try {
        const order = await createOrder({ customerName, products });
        res.status(201).json(order);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Product not found') {
                res.status(404).json({ error: error.message });
            } else if (error.message === 'Not enough inventory available') {
                res.status(400).json({ error: error.message });
            } else if (error.message === 'Failed to retrieve the order details after creation') {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});


export default router;
