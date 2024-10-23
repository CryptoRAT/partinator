import { parse } from 'csv-parse/sync';
import { importCsvLogger as logger } from "@loggers/loggers";

type StandardizedProduct = {
    category: string;
    threadSize: string;
    material: string;
    finish: string;
    quantity: number;
    price: number;
};

type ParseFunction = (record: any) => StandardizedProduct;

// Mapping of headers to corresponding parse functions
const parseFunctions: { [key: string]: ParseFunction } = {
    'product_id,description,thread_size,material,finish,quantity,price,category': (record) => ({
        category: record['category'],
        threadSize: record['thread_size'],
        material: record['material'],
        finish: record['finish'],
        quantity: parseInt(record['quantity'], 10),
        price: parseFloat(record['price']),
    }),
    'item_number,product_name,threading,composition,surface_treatment,stock,unit_cost,product_category': (record) => ({
        category: record['product_category'],
        threadSize: record['threading'],
        material: record['composition'],
        finish: record['surface_treatment'],
        quantity: parseInt(record['stock'], 10),
        price: parseFloat(record['unit_cost']),
    })
};

export function parseCSV(csvContent: string): StandardizedProduct[] {
    const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
    });

    if (records.length === 0) {
        throw new Error('CSV content is empty or invalid');
    }

    const headers = Object.keys(records[0]).join(',');
    const parseFunction = parseFunctions[headers];

    if (!parseFunction) {
        logger.error(`No parse function found for headers ${headers}`);
        throw new Error(`No parse function found for headers: ${headers}`);
    }

    return records.map(parseFunction);
}
