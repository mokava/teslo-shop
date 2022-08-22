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
	const product = await Product.findOne({ slug });
	if (!product)
		return res
			.status(404)
			.json({ message: `No existe el producto con el slug ${slug}` });
	await db.disconnect();

	product.images = product.images.map((image) => {
		return image.includes('http')
			? image
			: `${process.env.HOST_NAME}/products/${image}`;
	});

	return res.status(200).json(product);
};
