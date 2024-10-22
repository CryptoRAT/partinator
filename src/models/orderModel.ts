import { Model } from 'sequelize';
import { Product } from '@models/index';

class Order extends Model {
    public addProduct!: (product: Product, options?: any) => Promise<void>;
    public getProducts!: () => Promise<Product[]>;
}

export default Order;
