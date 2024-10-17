import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/__test__/**/*.test.ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};

export default config;