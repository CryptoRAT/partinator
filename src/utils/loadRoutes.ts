import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const loadRoutes = async (basePath: string): Promise<express.Router> => {
    const router = express.Router();

    // Get all route files
    const files = await fs.readdir(basePath);

    // Import routes from each file
    for (const file of files) {
        if (!file.includes('__test__')) {
            const filePath = path.join(basePath, file);
            try {
                const route = await import(filePath);

                if (route.default && typeof route.default === 'function') {
                    router.use(route.default);
                } else {
                    console.warn(`Could not load route from file ${file} -- Invalid default export`);
                }
            } catch (err) {
                console.error(`Failed to load route from file ${file}:`, err);
            }
        }
    }

    return router;
};


export default loadRoutes;
