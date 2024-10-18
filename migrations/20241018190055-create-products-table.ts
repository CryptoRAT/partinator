import { QueryInterface, DataTypes } from 'sequelize';
import { sequelizeLogger } from '@loggers/loggers';

export default {
  up: async (queryInterface: QueryInterface) => {
    try {
      await queryInterface.createTable('products', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        category: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        material: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        threadSize: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        finish: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        price: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      });
    } catch (error) {
      sequelizeLogger.error('Error creating products table:', error);
      throw error;
    }
  },

  down: async (queryInterface: QueryInterface) => {
    try {
      await queryInterface.dropTable('products');
    } catch (error) {
      sequelizeLogger.error('Error dropping products table:', error);
      throw error;
    }
  },
};
