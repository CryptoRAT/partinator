import express from 'express';
import fs from 'fs';
import path from 'path';

const loadRoutes = (basePath: string): express.Router => {
    const router = express.Router();

    // Get all route files
    const files = fs.readdirSync(basePath);

    // Import routes from each file
    files.forEach(file => {
        // Exclude files with '__test__' in their names
        if (!file.includes('__test__')) {
            const filePath = path.join(basePath, file);
            const route = require(filePath);

            // Check if the default export is a valid middleware function
            if (route.default && typeof route.default === 'function') {
                router.use(route.default);
            } else {
                console.warn(`Could not load route from file ${file} -- Invalid default export`);
            }
        }
    });

    return router;
};

export default loadRoutes;