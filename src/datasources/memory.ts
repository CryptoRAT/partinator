import { Sequelize } from 'sequelize';
import { sequelizeLogger } from '@loggers/loggers';

const getLogging = (): boolean | ((msg: string) => void) => {
    return (msg: string) => sequelizeLogger.debug(msg);
};

const storage = process.env.DATABASE_STORAGE || ':memory:';
const logging = getLogging();

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage,
    logging,
});

export { sequelize, getLogging };
export default sequelize;
