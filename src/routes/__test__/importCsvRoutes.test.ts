import request from 'supertest';
import app from '../../app';
import path from 'path';

describe('POST /api/import-csv', () => {
    let originalError: typeof console.error;
    let originalWarn: typeof console.warn;

    beforeAll(() => {
        originalError = console.error;
        console.error = jest.fn();
        originalWarn = console.warn;
        console.warn = jest.fn();
    });

    afterAll(() => {
        console.error = originalError;
        console.warn = originalWarn;
    });

    it('should successfully parse a valid CSV file', async () => {
        const response = await request(app)
            .post('/api/import-csv')
            .attach('file', path.join(__dirname, '../../utils/__test__/seller-a-basic-data.csv'));

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('File parsed successfully');
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return 400 if no file is uploaded', async () => {
        const response = await request(app).post('/api/import-csv');

        expect(response.status).toBe(400);
        expect(response.text).toBe('No file uploaded');
        expect(console.warn).toHaveBeenCalledWith('No file uploaded to api/import-csv');
    });

    it('should handle invalid CSV content', async () => {
        const invalidCsvContent = 'invalid_header,another_header\nvalue1,value2';
        const response = await request(app)
            .post('/api/import-csv')
            .attach('file', Buffer.from(invalidCsvContent), 'invalid.csv');

        expect(response.status).toBe(500);
        expect(response.text).toBe('An error occurred while processing the file');
        expect(console.error).toHaveBeenCalledWith('Error parsing CSV:', expect.any(Error));
    });
});
