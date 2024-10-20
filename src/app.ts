import express from 'express';
import loadRoutes from './loadRoutes';
import path from 'path';

import './loadEnv';
import swaggerUi from "swagger-ui-express";
import {swaggerSpec} from "@config/swaggerConfig";

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Load routes
const routesPath = path.join(__dirname, 'routes');
app.use('/', loadRoutes(routesPath));

export default app;
