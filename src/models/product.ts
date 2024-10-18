import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@db/memory';

interface ProductAttributes {
    id: number;
    name: string;
    category: string;
    material: string;
    threadSize: string;
    finish: string;
    quantity: number;
    price: number;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    public id!: number;
    public name!: string;
    public category!: string;
    public material!: string;
    public threadSize!: string;
    public finish!: string;
    public quantity!: number;
    public price!: number;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
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
    },
    {
        sequelize,
        modelName: 'Product',
        tableName: 'products',
        timestamps: true,
    }
);

export default Product;
