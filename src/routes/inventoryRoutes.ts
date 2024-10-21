import express from 'express';
import { updateInventory, getInventory } from '@controllers/inventoryController';
import { inventoryLogger as logger } from '@loggers/loggers';

const router = express.Router();

router.put('/api/inventory/:productId', async (req, res) => {
    try {
        const productId = parseInt(req.params.productId, 10);
        if (isNaN(productId)) {
            return res.status(400).json({ error: 'Invalid productId. It must be a number.' });
        }

        const { inventory } = req.body;
        if (inventory !== undefined) {
            if(inventory < 0) {
                return res.status(400).json({ error: 'Inventory cannot be negative' });
            }
            if(inventory > Number.MAX_SAFE_INTEGER) {
                return res.status(400).json({ error: 'Inventory value exceeds safe integer limits' });
            }
            const updatedProduct = await updateInventory(productId, inventory);
            res.status(200).json(updatedProduct);
        } else {
            res.status(400).send('No inventory in the request body');
        }
    } catch (error) {
        let errorMsg = 'Unknown error updating inventory';
        let status = 500;
        if (error instanceof Error) {
            errorMsg = error.message;
            if(errorMsg === 'Product not found') {
                status = 404;
            }
        }
        logger.error(errorMsg);
        res.status(status).json({ error: errorMsg });
    }
});

router.get('/api/inventory/:productId', async (req, res) => {
    try {
        const productId = parseInt(req.params.productId, 10);
        if (isNaN(productId)) {
            return res.status(400).json({ error: 'Invalid productId. It must be a number.' });
        }

        const inventory = await getInventory(productId);

        res.status(200).json({ inventory });
    } catch (error) {
        let errorMsg = 'Unknown error retrieving inventory';
        let status = 500;
        if (error instanceof Error) {
            errorMsg = error.message;
            if(errorMsg === 'Product not found') {
                status = 404;
            }
        }
        logger.error(errorMsg);
        res.status(status).json({ error: errorMsg });
    }
});




export default router;
