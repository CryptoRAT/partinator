import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/__test__/**/*.test.ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90,
        },
    },
};

export default config;