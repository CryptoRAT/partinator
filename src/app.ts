import express from 'express';
import loadRoutes from './loadRoutes';
import path from 'path';
import './loadEnv';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from '@config/swaggerConfig';

const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Load routes
const routesPath = path.resolve(__dirname, 'routes');

(async () => {
    const router = await loadRoutes(routesPath);
    app.use('/', router);
})();

export default app;
