// __test__/loadEnv.test.ts
import { getEnvFile } from '../loadEnv';

describe('Load Environment', () => {
    it('should return the correct environment file name based on NODE_ENV', () => {
        // Test when NODE_ENV is set to 'production'
        process.env.NODE_ENV = 'production';
        expect(getEnvFile()).toBe('.env.production');

        // Test when NODE_ENV is set to 'development'
        process.env.NODE_ENV = 'development';
        expect(getEnvFile()).toBe('.env.development');

        // Test when NODE_ENV is not set
        delete process.env.NODE_ENV;
        expect(getEnvFile()).toBe('.env.development');
    });
});
