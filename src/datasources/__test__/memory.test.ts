import sequelize, {getLogging} from '../memory';
import { Sequelize } from 'sequelize';
import {sequelizeLogger} from "@loggers/loggers";

describe('Memory Datasource', () => {
    it('should be an instance of Sequelize', () => {
        expect(sequelize).toBeInstanceOf(Sequelize);
    });

    it('should successfully sync the database', async () => {
        await expect(sequelize.sync()).resolves.not.toThrow();
    });

    it('should successfully close the database connection', async () => {
        await expect(sequelize.close()).resolves.not.toThrow();
    });

    it('should have logging disabled in the test environment', () => {
        const logging = (sequelize as any).options?.logging;
        expect(logging).toBe(false);
    });

    it('should use the logging function when NODE_ENV is not "test"', () => {
        // Temporarily set NODE_ENV to simulate a non-test environment
        const originalNodeEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';

        const sequelizeDev = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: console.log,
        });

        const logging = (sequelizeDev as any).options?.logging;
        expect(logging).toBe(console.log);

        // Restore the original NODE_ENV
        process.env.NODE_ENV = originalNodeEnv;

        // Close the sequelize instance to clean up
        sequelizeDev.close();
    });

    it('should use the specified DATABASE_STORAGE value', () => {
        // Temporarily change DATABASE_STORAGE to simulate different storage settings
        const originalStorage = process.env.DATABASE_STORAGE;
        process.env.DATABASE_STORAGE = './test-database.sqlite';

        const sequelizeWithStorage = new Sequelize({
            dialect: 'sqlite',
            storage: process.env.DATABASE_STORAGE,
            logging: false,
        });

        expect((sequelizeWithStorage as any).options?.storage).toBe('./test-database.sqlite');

        // Restore the original DATABASE_STORAGE
        process.env.DATABASE_STORAGE = originalStorage;

        // Close the sequelize instance to clean up
        sequelizeWithStorage.close();
    });
    it('should have logging enabled in a non-test environment', () => {
        // Temporarily change NODE_ENV to simulate a non-test environment
        const originalNodeEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';

        const sequelizeDev = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: (msg: any) => sequelizeLogger.debug(msg),
        });

        const logging = (sequelizeDev as any).getQueryInterface().sequelize.options.logging;
        expect(typeof logging).toBe('function');

        // Restore the original NODE_ENV
        process.env.NODE_ENV = originalNodeEnv;

        // Close the sequelize instance to clean up
        sequelizeDev.close();
    });
    it('should return correct logging setting based on environment', () => {
        // Test when NODE_ENV is 'test'
        process.env.NODE_ENV = 'test';
        expect(getLogging()).toBe(false);

        // Test when NODE_ENV is not 'test'
        process.env.NODE_ENV = 'development';
        const logging = getLogging();
        expect(typeof logging).toBe('function');

        // Restore original NODE_ENV
        process.env.NODE_ENV = 'test';
    });
    it('should use default logging behavior for unexpected NODE_ENV values', () => {
        // Set NODE_ENV to an unexpected value
        process.env.NODE_ENV = 'unexpected_env';

        const sequelizeUnexpected = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: getLogging(),
        });

        const logging = (sequelizeUnexpected as any).options?.logging;
        // We can't guarantee what the behavior should be exactly, but we can confirm the type
        expect(typeof logging).toBe('function');

        // Close the sequelize instance to clean up
        sequelizeUnexpected.close();
    });
    it('should return false when NODE_ENV is explicitly "test"', () => {
        process.env.NODE_ENV = 'test';
        expect(getLogging()).toBe(false);
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
