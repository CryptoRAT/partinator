import Product from '@models/product';

export const getProducts = async (filters: any, page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    return await Product.findAll({
        where: filters,
        offset,
        limit,
    });
};
