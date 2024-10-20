import { DataTypes, Model } from 'sequelize';
import sequelize from '@db/memory';

class Product extends Model {
    // timestamps
    readonly createdAt!: Date;
    readonly updatedAt!: Date;
    readonly deletedAt?: Date;
}

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
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'deleted_at',
        },
    },
    {
        sequelize,
        modelName: 'Product',
        tableName: 'products',
        timestamps: true,
        underscored: true,
        paranoid: true, // Enable soft deletes with Sequelize's `deletedAt` field
    }
);

export default Product;
