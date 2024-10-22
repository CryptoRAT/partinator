import sequelize, { getLogging, createSequelizeInstance, dotenvConfig } from '@db/sequelize';
import { Sequelize } from 'sequelize';
import path from "path";

describe('Sequelize Datasource - Happy Path Tests', () => {
    it('should be an instance of Sequelize', () => {
        expect(sequelize).toBeInstanceOf(Sequelize);
    });

    it('should successfully sync the database', async () => {
        await expect(sequelize.sync()).resolves.not.toThrow();
    });

    it('should successfully close the database connection', async () => {
        await expect(sequelize.close()).resolves.not.toThrow();
    });

    it('should use the logging function when NODE_ENV is "development"', () => {
        const originalNodeEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';

        const sequelizeDev = createSequelizeInstance();

        const logging = (sequelizeDev as any).options?.logging;
        expect(typeof logging).toBe('function');

        process.env.NODE_ENV = originalNodeEnv;

        sequelizeDev.close();
    });
});

describe('Sequelize Datasource - Branch Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should use default values when environment variables are missing', () => {
        // Store original environment variables
        const originalDatabaseName = process.env.DATABASE_NAME;
        const originalDatabaseUser = process.env.DATABASE_USER;
        const originalDatabasePassword = process.env.DATABASE_PASSWORD;
        const originalNodeEnv = process.env.NODE_ENV;

        // Delete environment variables to simulate missing values
        delete process.env.DATABASE_NAME;
        delete process.env.DATABASE_USER;
        delete process.env.DATABASE_PASSWORD;
        delete process.env.NODE_ENV;

        // Create a new sequelize instance using the createSequelizeInstance function
        const sequelizeWithoutEnv = createSequelizeInstance();

        // Check if the default values were used
        expect(sequelizeWithoutEnv.config.database).toBe('defaultdb');
        expect(sequelizeWithoutEnv.config.username).toBe('gary');
        expect(sequelizeWithoutEnv.config.password).toBe('indiana');

        // Restore original environment variables
        process.env.DATABASE_NAME = originalDatabaseName;
        process.env.DATABASE_USER = originalDatabaseUser;
        process.env.DATABASE_PASSWORD = originalDatabasePassword;
        process.env.NODE_ENV = originalNodeEnv;

        // Close the sequelize instance to clean up
        sequelizeWithoutEnv.close();
    });

    // TODO: This test only passes when using a real database. It's going to need more work to test it with sqlite.
    it.skip('should throw an error when failing to connect to the database due to incorrect credentials', async () => {
        // Store original environment variables
        const originalDatabaseName = process.env.DATABASE_NAME;
        const originalDatabaseUser = process.env.DATABASE_USER;
        const originalDatabasePassword = process.env.DATABASE_PASSWORD;

        // Set incorrect credentials
        process.env.DATABASE_NAME = 'wrong_db';
        process.env.DATABASE_USER = 'wrong_user';
        process.env.DATABASE_PASSWORD = 'wrong_password';

        // Create a new sequelize instance using the createSequelizeInstance function
        const sequelizeWithWrongCredentials = createSequelizeInstance();

        // Expect authentication to fail due to incorrect credentials
        await expect(sequelizeWithWrongCredentials.authenticate()).rejects.toThrow();

        // Restore original environment variables
        process.env.DATABASE_NAME = originalDatabaseName;
        process.env.DATABASE_USER = originalDatabaseUser;
        process.env.DATABASE_PASSWORD = originalDatabasePassword;

        // Close the sequelize instance to clean up
        sequelizeWithWrongCredentials.close();
    });


    it('should use default logging behavior for unexpected NODE_ENV values', () => {
        process.env.NODE_ENV = 'unexpected_env';

        const sequelizeUnexpected = createSequelizeInstance();

        const logging = (sequelizeUnexpected as any).options?.logging;
        expect(typeof logging).toBe('function');

        sequelizeUnexpected.close();
    });

    it('should correctly handle missing .env file for a given environment', () => {
        const originalNodeEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'non_existent_env';

        // Reset the modules to simulate loading a different .env file
        jest.resetModules();

        // Expect dotenvConfig to throw an error when the .env file is missing

        const config = dotenvConfig({
                path: path.resolve(__dirname, `../../config/.env.${process.env.NODE_ENV}`),
            });
        expect(config.error).toBeDefined();

        // Restore the original NODE_ENV
        process.env.NODE_ENV = originalNodeEnv;
    });


    it('should return correct logging configuration for known environments', () => {
        process.env.NODE_ENV = 'production';
        expect(typeof getLogging()).toBe('function');

        process.env.NODE_ENV = 'development';
        expect(typeof getLogging()).toBe('function');

        process.env.NODE_ENV = 'test';
        expect(typeof getLogging()).toBe('function');
    });

    it('should use default host when DATABASE_HOST is missing', () => {
        const originalDatabaseHost = process.env.DATABASE_HOST;
        delete process.env.DATABASE_HOST;

        const sequelizeWithoutHost = createSequelizeInstance();
        console.log(sequelizeWithoutHost.config.host)
        expect(sequelizeWithoutHost.config.host).toBe('localhost');

        process.env.DATABASE_HOST = originalDatabaseHost;
        sequelizeWithoutHost.close();
    });

    it('should use no storage when DIALECT is not sqlite', () => {
        const originalDatabaseStorage = process.env.DATABASE_STORAGE;
        const originalDatabaseDialect = process.env.DATABASE_DIALECT;
        delete process.env.DATABASE_STORAGE;
        process.env.DATABASE_DIALECT = 'postgres';

        const sequelizeWithoutStorage = createSequelizeInstance();

        expect((sequelizeWithoutStorage as any).options?.storage).toBe('');

        process.env.DATABASE_STORAGE = originalDatabaseStorage;
        process.env.DATABASE_DIALECT = originalDatabaseDialect;
        sequelizeWithoutStorage.close();
    });

    it('should use default dialect when DATABASE_DIALECT is missing', () => {
        const originalDatabaseDialect = process.env.DATABASE_DIALECT;
        delete process.env.DATABASE_DIALECT;

        const sequelizeWithoutDialect = createSequelizeInstance();

        expect((sequelizeWithoutDialect as any).options?.dialect).toBe('sqlite');

        process.env.DATABASE_DIALECT = originalDatabaseDialect;
        sequelizeWithoutDialect.close();
    });

    it('should use default port when DATABASE_PORT is missing', () => {
        const originalDatabasePort = process.env.DATABASE_PORT;
        const originalDatabaseDialect = process.env.DATABASE_DIALECT;
        delete process.env.DATABASE_PORT;
        process.env.DATABASE_DIALECT = 'sqlite';

        const sequelizeWithoutPort = createSequelizeInstance();

        expect((sequelizeWithoutPort as any).options?.port).toBe(5432);

        process.env.DATABASE_DIALECT = originalDatabaseDialect;
        process.env.DATABASE_PORT = originalDatabasePort;
        sequelizeWithoutPort.close();
    });

    it('should use default database configuration when all environment variables are missing', () => {
        // Store original environment variables
        const originalDatabaseName = process.env.DATABASE_NAME;
        const originalDatabaseUser = process.env.DATABASE_USER;
        const originalDatabasePassword = process.env.DATABASE_PASSWORD;
        const originalDatabaseHost = process.env.DATABASE_HOST;
        const originalDatabaseDialect = process.env.DATABASE_DIALECT;
        const originalDatabaseStorage = process.env.DATABASE_STORAGE;
        const originalDatabasePort = process.env.DATABASE_PORT;

        // Delete all environment variables
        delete process.env.DATABASE_NAME;
        delete process.env.DATABASE_USER;
        delete process.env.DATABASE_PASSWORD;
        delete process.env.DATABASE_HOST;
        delete process.env.DATABASE_DIALECT;
        delete process.env.DATABASE_STORAGE;
        delete process.env.DATABASE_PORT;

        // Create a new Sequelize instance
        const sequelizeWithoutEnv = createSequelizeInstance();

        // Verify default configurations
        expect(sequelizeWithoutEnv.config.database).toBe('defaultdb');
        expect(sequelizeWithoutEnv.config.username).toBe('gary');
        expect(sequelizeWithoutEnv.config.password).toBe('indiana');
        expect(sequelizeWithoutEnv.config.host).toBe('localhost');
        expect((sequelizeWithoutEnv as any).options.dialect).toBe('sqlite');
        expect((sequelizeWithoutEnv as any).options.storage).toBe(':memory');
        expect((sequelizeWithoutEnv as any).options.port).toBe(5432);

        // Restore original environment variables
        process.env.DATABASE_NAME = originalDatabaseName;
        process.env.DATABASE_USER = originalDatabaseUser;
        process.env.DATABASE_PASSWORD = originalDatabasePassword;
        process.env.DATABASE_HOST = originalDatabaseHost;
        process.env.DATABASE_DIALECT = originalDatabaseDialect;
        process.env.DATABASE_STORAGE = originalDatabaseStorage;
        process.env.DATABASE_PORT = originalDatabasePort;

        sequelizeWithoutEnv.close();
    });
});

describe('Sequelize Datasource - Limit Tests', () => {
    it('should throw an error when an invalid dialect is provided', () => {
        expect(() => {
            new Sequelize('invalid_database', 'user', 'password', {
                host: 'localhost',
                dialect: 'invalid_dialect' as any,
                logging: false,
            });
        }).toThrow();
    });

    it('should return a function for any environment other than "test"', () => {
        process.env.NODE_ENV = 'development';
        expect(typeof getLogging()).toBe('function');

        process.env.NODE_ENV = 'production';
        expect(typeof getLogging()).toBe('function');

        process.env.NODE_ENV = 'custom_env';
        expect(typeof getLogging()).toBe('function');
    });
});
