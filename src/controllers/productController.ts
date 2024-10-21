import ProductModel from '@models/productModel';

export const getProducts = async (filters: any, page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    return await ProductModel.findAll({
        where: filters,
        offset,
        limit,
    });
};
