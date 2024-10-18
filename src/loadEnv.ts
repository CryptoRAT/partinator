import { config } from 'dotenv';
import path from 'path';

export function getEnvFile(): string {
    return process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV}`
        : '.env.development';
}

const envFile = getEnvFile();
config({ path: path.resolve(__dirname, '../config', envFile) });
