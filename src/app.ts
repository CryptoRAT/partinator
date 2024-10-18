import express from 'express';
import loadRoutes from './loadRoutes';
import path from 'path';
const app = express();
import './loadEnv';

// Load routes
const routesPath = path.join(__dirname, 'routes');
app.use('/', loadRoutes(routesPath));

export default app;
