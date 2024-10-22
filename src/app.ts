import express from 'express';
import loadRoutes from './loadRoutes';
import path from 'path';
import './loadEnv';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from '@config/swaggerConfig';
import options from '@config/jsadmin.options.ts';
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express"

const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/', (_, res) => {
    res.redirect('/api-docs/');
});
const admin = new AdminJS(options);
const adminRouter = AdminJSExpress.buildRouter(admin);
app.use(admin.options.rootPath, adminRouter);
// Load routes
const routesPath = path.resolve(__dirname, 'routes');

(async () => {
    const router = await loadRoutes(routesPath);
    if (process.env.NODE_ENV === 'production') {
        await admin.initialize();
    } else {
        await admin.watch();
    }
    app.use('/', router);

})();


export default app;
