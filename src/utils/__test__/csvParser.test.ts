import { parseCSV } from '../csvParser';
import { promises as fs } from 'fs';
import path from 'path';

describe('CSV Parser Utility', () => {
    it('should correctly parse and standardize a CSV file from Seller A', async () => {
        const csvPath = path.join(__dirname, '../__test__/seller-a-basic-data.csv');
        const csvContent = await fs.readFile(csvPath, 'utf-8');

        const result = parseCSV(csvContent);

        // Check the row count
        expect(result.length).toBe(5);

        // Check specific fields from different rows to cover all columns
        expect(result[0].category).toBe('Hex Cap Screw');
        expect(result[1].finish).toBe('Teflon Blue');
        expect(result[2].threadSize).toBe('M12-1.75');
        expect(result[3].material).toBe('Steel');
        expect(result[4].price).toBe(0.40);
    });

    it('should correctly parse and standardize a CSV file from Seller B', async () => {
        const csvPath = path.join(__dirname, '../__test__/seller-b-basic-data.csv');
        const csvContent = await fs.readFile(csvPath, 'utf-8');

        const result = parseCSV(csvContent);

        // Check the row count
        expect(result.length).toBe(5);

        // Check specific fields from different rows to cover all columns
        expect(result[0].category).toBe('Hex Cap Screw');
        expect(result[1].finish).toBe('Zinc');
        expect(result[2].threadSize).toBe('1/4-20');
        expect(result[3].material).toBe('Aluminum');
        expect(result[4].price).toBe(0.70);
    });

    it('should throw an error for unknown CSV headers', () => {
        const invalidCsvContent = 'unknown_header,another_header\nvalue1,value2';
        expect(() => parseCSV(invalidCsvContent)).toThrow(
            'No parse function found for headers: unknown_header,another_header'
        );
    });

    it('should throw an error for empty CSV content', () => {
        const emptyCsvContent = '';
        expect(() => parseCSV(emptyCsvContent)).toThrow(
            'CSV content is empty or invalid'
        );
    });
});
