import { DataTypes } from 'sequelize';
import { QueryInterface } from 'sequelize';
import { ORDER_STATUSES } from '@config/orderConstants';

export default {
  up: async (queryInterface: QueryInterface) => {
    console.log("Creating orders table with ENUM for status...");
    await queryInterface.createTable('orders', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      customerName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...ORDER_STATUSES),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    // Log a success message
    console.log("Orders table successfully created!");

    // Additional table: OrderProducts
    await queryInterface.createTable('OrderProducts', {
      orderId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'orders',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'products',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    console.log("Dropping OrderProducts table...");
    await queryInterface.dropTable('OrderProducts');
    console.log("Dropping orders table...");
    await queryInterface.dropTable('orders');
  },
};

