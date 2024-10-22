import { Sequelize } from 'sequelize';
import { config as dotenvConfig } from 'dotenv';
import path from 'path';
import { sequelizeLogger } from '@loggers/loggers';

// Determine the current environment
const currentEnv = process.env.NODE_ENV || 'development';

// Load environment variables from the appropriate .env file
dotenvConfig({
    path: path.resolve(__dirname, `../../config/.env.${currentEnv}`),
});

// Logging function for Sequelize
export const getLogging = (): boolean | ((msg: string) => void) => {
    return currentEnv === 'development' || currentEnv === 'test'
        ? (msg: string) => sequelizeLogger.debug(msg)
        : false;
};

// Create a Sequelize instance
const sequelize = new Sequelize(
    process.env.DATABASE_NAME || 'partinator',
    process.env.DATABASE_USER || '',
    process.env.DATABASE_PASSWORD || '',
    {
        host: process.env.DATABASE_HOST || 'localhost',
        dialect: process.env.DATABASE_DIALECT as any,
        storage: process.env.DATABASE_STORAGE, // Use in-memory storage for SQLite
        port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : undefined,
        logging: getLogging(),
    }
);

export default sequelize;
