import { DataTypes, Model } from 'sequelize';
import sequelize from '@db/memory';

class ProductModel extends Model { }

ProductModel.init(
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
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        inventory: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'deleted_at',
        },
    },
    {
        sequelize,
        modelName: 'ProductModel',
        tableName: 'products',
        timestamps: true,
        underscored: true,
        paranoid: true, // Enable soft deletes with Sequelize's `deletedAt` field
    }
);

export default ProductModel;
