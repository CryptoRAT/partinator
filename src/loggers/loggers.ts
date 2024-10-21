import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
)

const sequelizeLogger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports: [
        new DailyRotateFile({
            filename: 'sequelize-%DATE%.log',
            dirname: './logs',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '7d',
        }),
    ],
})

const productsLogger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports: [
        new DailyRotateFile({
            filename: 'products-%DATE%.log',
            dirname: './logs',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '7d',
        }),
    ],
})

const inventoryLogger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports: [
        new DailyRotateFile({
            filename: 'inventory-%DATE%.log',
            dirname: './logs',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '7d',
        }),
    ],
})

const orderLogger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports: [
        new DailyRotateFile({
            filename: 'order-%DATE%.log',
            dirname: './logs',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '7d',
        }),
    ],
})

export {
    sequelizeLogger,
    productsLogger,
    inventoryLogger,
    orderLogger,
}
