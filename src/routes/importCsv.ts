import express, { Request, Response } from 'express';
import multer from 'multer';
import { parseCSV } from '../utils/csvParser';

const router = express.Router();
const upload = multer(); // TODO: research best middleware to handle file uploads

router.post('/api/import-csv', upload.single('file'), (req: Request, res: Response) => {
    try {
        if (!req.file) {
            console.warn('No file uploaded to api/import-csv');
            return res.status(400).send('No file uploaded');
        }

        const csvContent = req.file.buffer.toString('utf-8');
        const parsedData = parseCSV(csvContent);

        res.status(200).json({ message: 'File parsed successfully', data: parsedData });
    } catch (error) {
        console.error('Error parsing CSV:', error);
        res.status(500).send('An error occurred while processing the file');
    }
});

export default router;
