import express from 'express';
import loadRoutes from './loadRoutes';
import path from 'path';

import './loadEnv';
import swaggerUi from "swagger-ui-express";
import {swaggerSpec} from "@config/swaggerConfig";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Load routes
const routesPath = path.join(__dirname, 'routes');
app.use('/', loadRoutes(routesPath));

export default app;
