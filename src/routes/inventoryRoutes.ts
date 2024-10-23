import express from 'express';
import { updateInventory, getInventory, getInventories } from '@controllers/inventoryController';
import { inventoryLogger as logger } from '@loggers/loggers';

const router = express.Router();

/**
 * @swagger
 * /api/inventories/{productId}:
 *   put:
 *     summary: Update inventory for a specific product
 *     description: Updates the inventory value of a product identified by `productId`.
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product to update inventory for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inventory:
 *                 type: integer
 *                 description: The new inventory value for the product
 *     responses:
 *       200:
 *         description: Inventory updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productId:
 *                   type: integer
 *                 inventory:
 *                   type: integer
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid productId. It must be a number."
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
 *                   example: "Unknown error updating inventory"
 *
 *   get:
 *     summary: Get inventory for a specific product
 *     description: Retrieves the current inventory value of a product identified by `productId`.
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product to retrieve inventory for
 *     responses:
 *       200:
 *         description: Inventory retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inventory:
 *                   type: integer
 *       400:
 *         description: Invalid productId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid productId. It must be a number."
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
 *                   example: "Unknown error retrieving inventory"
 */
router.put('/inventories/:productId', async (req, res) => {
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

router.get('/inventories/:productId', async (req, res) => {
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

/**
 * @swagger
 * /api/inventories:
 *   get:
 *     summary: Get all inventories
 *     description: Retrieves the inventory value for all products.
 *     responses:
 *       200:
 *         description: Inventories retrieved successfully
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
 *                   inventory:
 *                     type: integer
 */
router.get('/inventories', async (_, res) => {
    try {
        const inventories = await getInventories();
        res.set('Content-Range', `inventories 0-${inventories.length}/${inventories.length}`);
        res.status(200).json(inventories);
    } catch (error) {
        logger.error('Error retrieving inventories:', error);
        res.status(500).json({ error: 'Error retrieving inventories' });
    }
});

/**
 * Existing PUT and GET endpoints for a specific product by ID.
 */
router.put('/inventories/:productId', async (req, res) => {
    try {
        const productId = parseInt(req.params.productId, 10);
        if (isNaN(productId)) {
            return res.status(400).json({ error: 'Invalid productId. It must be a number.' });
        }

        const { inventory } = req.body;
        if (inventory !== undefined) {
            if (inventory < 0) {
                return res.status(400).json({ error: 'Inventory cannot be negative' });
            }
            if (inventory > Number.MAX_SAFE_INTEGER) {
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
            if (errorMsg === 'Product not found') {
                status = 404;
            }
        }
        logger.error(errorMsg);
        res.status(status).json({ error: errorMsg });
    }
});

router.get('/inventories/:productId', async (req, res) => {
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
            if (errorMsg === 'Product not found') {
                status = 404;
            }
        }
        logger.error(errorMsg);
        res.status(status).json({ error: errorMsg });
    }
});



export default router;
