import { config as dotenvConfig } from 'dotenv';
import path from 'path';

dotenvConfig({
    path: path.resolve(__dirname, `../config/.env.${process.env.NODE_ENV || 'development'}`)
});

module.exports = {
    development: {
        dialect: 'sqlite',
        storage: process.env.DATABASE_STORAGE || ':memory:',
        logging: process.env.LOG_LEVEL === 'debug' ? console.log : false,
    },
    test: {
        dialect: 'sqlite',
        storage: process.env.DATABASE_STORAGE || ':memory:',
        logging: false,
    },
    production: {
        dialect: 'sqlite',
        storage: process.env.DATABASE_STORAGE || './database.sqlite',
        logging: process.env.LOG_LEVEL === 'debug' ? console.log : false,
    },
};
