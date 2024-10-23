import express, { Request, Response } from 'express';
import multer from 'multer';
import { parseCSV } from '@utils/csvParser';
import { importCsvLogger as logger } from "@loggers/loggers";

const router = express.Router();
const upload = multer(); // TODO: research best middleware to handle file uploads

/**
 * @swagger
 * /api/importcsv:
 *   post:
 *     summary: Import a CSV file
 *     description: Parses the uploaded CSV file and returns the parsed data.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The CSV file to be uploaded
 *     responses:
 *       200:
 *         description: File parsed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File parsed successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Parsed data from the CSV file
 *       400:
 *         description: No file uploaded
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: No file uploaded
 *       500:
 *         description: Internal server error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: An error occurred while processing the file
 */
router.post('/importcsv', upload.single('file'), (req: Request, res: Response) => {
    try {
        if (!req.file) {
            logger.warn('No file uploaded to /importcsv');
            return res.status(400).send('No file uploaded');
        }

        const csvContent = req.file.buffer.toString('utf-8');
        const parsedData = parseCSV(csvContent);

        res.status(200).json({ message: 'File parsed successfully', data: parsedData });
    } catch (error) {
        logger.error('Error parsing CSV:', error);
        res.status(500).send('An error occurred while processing the file');
    }
});

export default router;
