import { Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import NextLink from 'next/link';
import { ShopLayout } from '../../components/layouts';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { redirect } from 'next/dist/server/api-utils';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces/order';

interface Props {
	orders: IOrder[];
}

const columns: GridColDef[] = [
	{ field: 'id', headerName: 'ID', width: 100 },
	{ field: 'fullName', headerName: 'Nombre completo', width: 300 },
	{
		field: 'paid',
		headerName: 'Pagada',
		description: 'Muestra la información de si está pagada la orden o no',
		width: 200,
		renderCell: (params: GridValueGetterParams) => {
			return params.row.paid ? (
				<Chip color='success' label='Pagada' variant='outlined' />
			) : (
				<Chip color='error' label='No pagada' variant='outlined' />
			);
		},
	},
	{
		field: 'link',
		headerName: 'Ver orden',
		width: 100,
		sortable: false,
		renderCell: (params: GridValueGetterParams) => {
			return (
				<NextLink href={`/orders/${params.row.orderId}`} passHref>
					<Link underline='always'>Ver orden</Link>
				</NextLink>
			);
		},
	},
];

const HistoryPage = ({ orders }: Props) => {
	const rows = orders.map((o, i) => ({
		id: i + 1,
		paid: o.isPaid,
		fullName: o.shippingAddress.lastName + ' ' + o.shippingAddress.firstName,
		orderId: o._id,
	}));

	return (
		<ShopLayout
			title='Historial de órdenes'
			pageDescription='Historial de órdenes del cliente'
		>
			<Typography variant='h1' component='h1'>
				Historial de órdenes
			</Typography>
			<Grid container className='fadeIn'>
				<Grid item xs={12} sx={{ height: 650, width: '100%' }}>
					<DataGrid
						rows={rows}
						columns={columns}
						pageSize={10}
						rowsPerPageOptions={[10]}
					/>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const session: any = await getSession({ req });

	if (!session) {
		return {
			redirect: {
				destination: '/auth/login?p=/orders/history',
				permanent: false,
			},
		};
	}

	const orders = await dbOrders.getOrdersByUser(session.user._id);

	return {
		props: {
			orders,
		},
	};
};

export default HistoryPage;
