import fs from 'fs';
import path from 'path';
import loadRoutes from '@utils/loadRoutes';

jest.mock('fs');

describe('loadRoutes', () => {
    let originalWarn: typeof console.warn;

    beforeAll(() => {
        originalWarn = console.warn;
        console.warn = jest.fn();
    });

    afterAll(() => {
        console.warn = originalWarn;
    });

    it('should warn if a route file has an invalid default export', async () => {
        // Mocking readdirSync to simulate route files
        (fs.readdirSync as jest.Mock).mockReturnValue(['invalidRoute.ts']);

        // Correct basePath to point to the actual mocked directory structure
        const basePath = path.join(__dirname, 'mock/basePath');

        await loadRoutes(basePath);

        expect(console.warn).toHaveBeenCalledWith(
            'Could not load route from file invalidRoute.ts -- Invalid default export'
        );
    });
});
