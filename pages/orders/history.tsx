import { Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import NextLink from 'next/link';
import { ShopLayout } from '../../components/layouts';

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
				<NextLink href={`/orders/${params.row.id}`} passHref>
					<Link underline='always'>Ver orden</Link>
				</NextLink>
			);
		},
	},
];

const rows = [
	{ id: 1, paid: true, fullName: 'Matias Romera' },
	{ id: 2, paid: true, fullName: 'Belen Rukavina' },
	{ id: 3, paid: false, fullName: 'Leonardo Romera' },
	{ id: 4, paid: true, fullName: 'Ironman' },
	{ id: 5, paid: true, fullName: 'Dr Strange' },
	{ id: 6, paid: false, fullName: 'Thor' },
	{ id: 7, paid: false, fullName: 'Hulk' },
	{ id: 8, paid: true, fullName: 'Hawkeye' },
	{ id: 9, paid: false, fullName: 'Capitán América' },
	{ id: 10, paid: true, fullName: 'Viuda Negra' },
	{ id: 11, paid: false, fullName: 'Antman' },
	{ id: 12, paid: false, fullName: 'Spiderman' },
];

const HistoryPage = () => {
	return (
		<ShopLayout
			title='Historial de órdenes'
			pageDescription='Historial de órdenes del cliente'
		>
			<Typography variant='h1' component='h1'>
				Historial de órdenes
			</Typography>
			<Grid container>
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
export default HistoryPage;
