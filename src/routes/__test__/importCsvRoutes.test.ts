import request from 'supertest';
import app from '../../app';
import path from 'path';
import { importCsvLogger as logger } from '@loggers/loggers';

describe('POST /api/importcsv', () => {
    let originalError: typeof logger.error;
    let originalWarn: typeof logger.warn;

    beforeAll(() => {
        // Mock the logger's error and warn methods
        originalError = logger.error;
        logger.error = jest.fn();
        originalWarn = logger.warn;
        logger.warn = jest.fn();
    });

    afterAll(() => {
        // Restore the original logger methods
        logger.error = originalError;
        logger.warn = originalWarn;
    });

    it('should successfully parse a valid CSV file', async () => {
        const response = await request(app)
            .post('/api/importcsv')
            .attach('file', path.join(__dirname, '../../utils/__test__/seller-a-basic-data.csv'));

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('File parsed successfully');
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return 400 if no file is uploaded', async () => {
        const response = await request(app).post('/api/importcsv');

        expect(response.status).toBe(400);
        expect(response.text).toBe('No file uploaded');
        expect(logger.warn).toHaveBeenCalledWith('No file uploaded to /importcsv');
    });

    it('should handle invalid CSV content', async () => {
        const invalidCsvContent = 'invalid_header,another_header\nvalue1,value2';
        const response = await request(app)
            .post('/api/importcsv')
            .attach('file', Buffer.from(invalidCsvContent), 'invalid.csv');

        expect(response.status).toBe(500);
        expect(response.text).toBe('An error occurred while processing the file');
        expect(logger.error).toHaveBeenCalledWith('Error parsing CSV:', expect.any(Error));
    });
});
