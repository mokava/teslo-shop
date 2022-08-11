import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { IProduct } from '../../../interfaces/products';
import Product from '../../../models/Product';

type Data =
	| {
			message: string;
	  }
	| IProduct;

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case 'GET':
			return getSlug(req, res);
		default:
			return res
				.status(404)
				.json({ message: `Método ${req.method} no permitido` });
	}
}

const getSlug = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { slug } = req.query;
	await db.connect();
	const products = await Product.findOne({ slug });
	if (!products)
		return res
			.status(404)
			.json({ message: `No existe el producto con el slug ${slug}` });
	await db.disconnect();
	return res.status(200).json(products);
};
