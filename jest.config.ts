import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest/presets/default-esm', // Use ESM preset
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/__test__/**/*.test.ts'],
    transform: {
        '^.+\\.ts$': ['ts-jest', { useESM: true }],
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
    moduleNameMapper: {
        '^@db/(.*)$': '<rootDir>/src/datasources/$1',
        '^@admin/(.*)$': '<rootDir>/src/admin/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@models/(.*)$': '<rootDir>/src/models/$1',
        '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
        '^@loggers/(.*)$': '<rootDir>/src/loggers/$1',
        '^@config/(.*)$': '<rootDir>/config/$1',
    },
    extensionsToTreatAsEsm: ['.ts'],
};

export default config;
