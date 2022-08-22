import {
	AccessTimeOutlined,
	AttachMoneyOutlined,
	CancelPresentationOutlined,
	CategoryOutlined,
	CreditCardOffOutlined,
	CreditCardOutlined,
	DashboardOutlined,
	GroupOutlined,
	ProductionQuantityLimitsOutlined,
} from '@mui/icons-material';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { SummaryTile } from '../../components/admin';
import { AdminLayout } from '../../components/layouts';
import useSWR from 'swr';
import { DashboardSummaryResponse } from '../../interfaces';
import { useState, useEffect } from 'react';

const DashboardPage = () => {
	const { data, error } = useSWR<DashboardSummaryResponse>(
		'/api/admin/dashboard',
		{
			refreshInterval: 30 * 1000,
		}
	);

	const [refreshIn, setRefreshIn] = useState(30);

	useEffect(() => {
		const interval = setInterval(() => {
			// console.log('Tick');
			setRefreshIn((refreshIn) => (refreshIn > 0 ? refreshIn - 1 : 30));
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	if (!error && !data) {
		return <></>;
	}

	if (error) {
		console.log(error);
		return <Typography>Error al cargar</Typography>;
	}

	const {
		numberOfOrders,
		paidOrders,
		notPaidOrders,
		numberOfClients,
		numberOfProducts,
		productsWithNoInventory,
		lowInventory,
	} = data!;

	return (
		<AdminLayout
			title='Dashboard'
			subtitle='Estadisticas generales'
			icon={<DashboardOutlined />}
		>
			<Grid container spacing={2}>
				<SummaryTile
					title={numberOfOrders}
					subTitle={'Órdenes totales'}
					icon={<CreditCardOutlined color='secondary' sx={{ fontSize: 40 }} />}
				/>
				<SummaryTile
					title={paidOrders}
					subTitle={'Órdenes pagadas'}
					icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />}
				/>
				<SummaryTile
					title={notPaidOrders}
					subTitle={'Órdenes pendientes'}
					icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} />}
				/>
				<SummaryTile
					title={numberOfClients}
					subTitle={'Clientes'}
					icon={<GroupOutlined color='primary' sx={{ fontSize: 40 }} />}
				/>
				<SummaryTile
					title={numberOfProducts}
					subTitle={'Productos'}
					icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }} />}
				/>
				<SummaryTile
					title={productsWithNoInventory}
					subTitle={'Productos sin existencia'}
					icon={
						<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />
					}
				/>
				<SummaryTile
					title={lowInventory}
					subTitle={'Bajo inventario'}
					icon={
						<ProductionQuantityLimitsOutlined
							color='warning'
							sx={{ fontSize: 40 }}
						/>
					}
				/>
				<SummaryTile
					title={refreshIn}
					subTitle={'Actualización en '}
					icon={<AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} />}
				/>
			</Grid>
		</AdminLayout>
	);
};
export default DashboardPage;
