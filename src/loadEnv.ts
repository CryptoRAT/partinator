import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getEnvFile(): string {
    return process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV}`
        : '.env.development';
}

const envFile = getEnvFile();
config({ path: path.resolve(__dirname, '../config', envFile) });
