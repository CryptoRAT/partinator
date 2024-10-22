const { config: dotenvConfig } = require('dotenv');
const path = require('path');
const sequelize = require('../src/datasources/sequelize').default;

// Load environment variables from the correct .env file based on NODE_ENV
dotenvConfig({ path: path.resolve(__dirname, `../config/.env.${process.env.NODE_ENV || 'development'}`) });

// Extract properties from Sequelize configuration
const dbConfig = {
    dialect: sequelize.getDialect(),
    host: sequelize.config.host,
    database: sequelize.config.database,
    username: sequelize.config.username,
    password: sequelize.config.password,
    logging: false,
};

console.log(`Using database user: ${dbConfig.username}`);
console.log(`Using database password: ${dbConfig.password}`);

// Define separate environments for sequelize-cli
module.exports = {
    development: dbConfig,
    test: dbConfig,
    production: dbConfig,
};
