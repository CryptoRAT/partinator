import express from 'express';
import fs from 'fs';
import path from 'path';


const loadRoutes = (basePath: string): express.Router => {
    const router = express.Router();

    // Get all route files
    const files = fs.readdirSync(basePath);

    // Import routes from each file synchronously using require
    files.forEach(file => {
        // Exclude files with '__test__' in their names
        if (!file.includes('__test__')) {
            const filePath = path.join(basePath, file);
            try {
                const route = require(filePath);
                // Check if the default export is a valid middleware function
                if (route.default && typeof route.default === 'function') {
                    router.use(route.default);
                } else {
                    console.warn(`Could not load route from file ${file} -- Invalid default export`);
                }
            } catch (err) {
                console.error(`Failed to load route from file ${file}:`, err);
            }
        }
    });

    return router;
};

export default loadRoutes;
