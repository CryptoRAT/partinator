import { Sequelize } from 'sequelize';
import {config as dotenvConfig} from 'dotenv';
import path from 'path';
import {sequelizeLogger} from '@loggers/loggers';

// Determine the current environment
const currentEnv = process.env.NODE_ENV || 'development';

// Load environment variables from the appropriate .env file
dotenvConfig({
    path: path.resolve(__dirname, `../../config/.env.${currentEnv}`),
});


// Logging function for Sequelize
export const getLogging = (): boolean | ((msg: string) => void) => {
    return (msg: string) => sequelizeLogger.debug(msg)
};


const createSequelizeInstance = (): Sequelize => {
    const database = process.env.DATABASE_NAME || 'defaultdb';
    const username = process.env.DATABASE_USER || 'gary';
    const password = process.env.DATABASE_PASSWORD || 'indiana';
    const host = process.env.DATABASE_HOST || 'localhost';
    const dialect = (process.env.DATABASE_DIALECT || 'sqlite') as 'mysql' | 'postgres' | 'sqlite' | 'mssql';
    let storage = ''
    if (dialect === 'sqlite') {
        storage = ':memory';
    }
    const port = process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432;
    const logging = getLogging();
    const sequelize = new Sequelize(
        database,
        username,
        password,
        {
            host,
            dialect,
            storage,
            port,
            logging,
        }
    );
    if(!sequelize) {
        throw new Error('Sequelize instance not created');
    }
    return sequelize;
};



// Default instance used throughout the application
const sequelize = createSequelizeInstance();

export {dotenvConfig, createSequelizeInstance}
export default sequelize;
