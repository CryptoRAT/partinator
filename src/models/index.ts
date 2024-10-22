import { DataTypes } from 'sequelize';
import sequelize from '@db/sequelize';
import Product from '@models/productModel';
import Order from '@models/orderModel';
import OrderProduct from "@models/orderProductModel.ts";
import { ORDER_STATUSES } from '@config/orderConstants';

Product.init(
    {
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
            field: 'thread_size',
        },
        finish: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER, // we could do BIGINT here, do we expect to exceed 2,147,483,647 in quantity?
            allowNull: false,
            defaultValue: 0,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        inventory: {
            type: DataTypes.INTEGER, // we could do BIGINT here, do we expect to exceed 2,147,483,647 in inventory?
            allowNull: false,
            defaultValue: 0,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'deleted_at',
        },
        version: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: 'Product',
        tableName: 'products',
        timestamps: true,
        underscored: true,
        paranoid: true, // Enable soft deletes
        version: true, // Enable optimistic locking
    }
);

Order.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        customerName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(...ORDER_STATUSES), // Use literal values directly
            allowNull: false,
            validate: {
                isIn: [ORDER_STATUSES], // Use literal values directly for validation
            },
        },
        version: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: 'Order',
        tableName: 'orders',
        timestamps: true,
        underscored: true,
        paranoid: true, // Enable soft deletes
        version: true, // Enable optimistic locking
    }
);
OrderProduct.init(
    {
        orderId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'orders',
                key: 'id',
            },
            primaryKey: true,
        },
        productId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'products',
                key: 'id',
            },
            primaryKey: true,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
    },
    {
        sequelize,
        modelName: 'OrderProduct',
        tableName: 'OrderProducts',
        timestamps: true, // Adds createdAt and updatedAt
        underscored: true,
        paranoid: true, // Enable soft deletes
        version: true, // Enable optimistic locking
    }
);

// Define associations
Order.belongsToMany(Product, {
    through: OrderProduct,
    foreignKey: 'orderId',
    otherKey: 'productId',
});

Product.belongsToMany(Order, {
    through: OrderProduct,
    foreignKey: 'productId',
    otherKey: 'orderId',
});

// Export all models for use in other parts of the application
export { sequelize, Product, Order };
