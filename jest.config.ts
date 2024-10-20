import { createDefaultEsmPreset, type JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
    preset: 'ts-jest/presets/default-esm', // Use the default ESM preset for ts-jest
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/__test__/**/*.test.ts'],
    transform: {
        ...createDefaultEsmPreset().transform,
    },
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^@db/(.*)$': '<rootDir>/src/datasources/$1',
        '^@admin/(.*)$': '<rootDir>/src/admin/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@models/(.*)$': '<rootDir>/src/models/$1',
        '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
        '^@loggers/(.*)$': '<rootDir>/src/loggers/$1',
        '^@config/(.*)$': '<rootDir>/config/$1',
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
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],  // Update to use ESM setup file
};

export default config;
