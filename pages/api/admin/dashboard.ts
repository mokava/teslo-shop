import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { User, Order, Product } from '../../../models';

type Data =
	| {
			numberOfOrders: number;
			paidOrders: number;
			notPaidOrders: number;
			numberOfClients: number;
			numberOfProducts: number;
			productsWithNoInventory: number;
			lowInventory: number;
	  }
	| { message: string };

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case 'GET':
			return getDataDashboard(req, res);
		default:
			return res.status(400).json({ message: 'Bad request' });
	}
}

const getDataDashboard = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	await db.connect();

	// const numberOfOrders = await Order.count();
	// const paidOrders = await Order.where({ isPaid: 'true' }).count();
	// const notPaidOrders = await Order.where({ isPaid: 'false' }).count();
	// const numberOfClients = await User.where({ role: 'client' }).count();
	// const numberOfProducts = await Product.count();
	// const productsWithNoInventory = await Product.where({ inStock: 0 }).count();
	// const lowInventory = await Product.where({ inStock: { $lte: 10 } }).count();

	const [
		numberOfOrders,
		paidOrders,
		numberOfClients,
		numberOfProducts,
		productsWithNoInventory,
		lowInventory,
	] = await Promise.all([
		Order.count(),
		Order.where({ isPaid: 'true' }).count(),
		User.where({ role: 'client' }).count(),
		Product.count(),
		Product.where({ inStock: 0 }).count(),
		Product.where({ inStock: { $lte: 10 } }).count(),
	]);

	const notPaidOrders = numberOfOrders - paidOrders;

	res.status(200).json({
		numberOfOrders,
		paidOrders,
		notPaidOrders,
		numberOfClients,
		numberOfProducts,
		productsWithNoInventory,
		lowInventory,
	});
};
