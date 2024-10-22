import { Router } from 'express';
import { createOrder } from '@controllers/orderController';

interface ProductInput {
    productId: number;
    quantity: number;
}

const router = Router();

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
