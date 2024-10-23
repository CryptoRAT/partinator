import cors from 'cors';
import express from 'express';
import loadRoutes from '@utils/loadRoutes.ts';
import path from 'path';
import './loadEnv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@config/swaggerConfig';

const app = express();

// Use CORS middleware to allow cross-origin requests
app.use(cors({
    origin: 'http://localhost:2001',
    exposedHeaders: ['Content-Range']
}));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/', (_, res) => {
    // Redirect root URL to React Admin running on port 2001
    res.redirect('http://localhost:2001');
});

// Load routes
const routesPath = path.resolve(__dirname, 'routes');
(async () => {
    const router = await loadRoutes(routesPath);
    app.use('/api', router);
})();

export default app;
