// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { db, seedProducts } from '../../database';
import { Product } from '../../models';

type Data = {
	message: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	if (process.env.NODE_ENV === 'production') {
		return res.status(401).json({ message: 'No tienes permisos' });
	}
	await db.connect();

	await Product.deleteMany();
	await Product.insertMany(seedProducts.initialData.products);

	await db.disconnect();

	res.status(200).json({ message: 'Proceso realizado correctamente' });
}
