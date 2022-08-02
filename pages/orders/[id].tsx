import {
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	Divider,
	Grid,
	Link,
	Typography,
} from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { CartList, OrderSummary } from '../../components/cart';
import NextLink from 'next/link';
import {
	CreditCardOffOutlined,
	CreditScoreOutlined,
} from '@mui/icons-material';

const OrderPage = () => {
	return (
		<ShopLayout
			title='Resumen de orden - 3'
			pageDescription={'Resumen de la orden'}
		>
			<Typography variant='h1' component='h1'>
				Orden: ABC123
			</Typography>
			<Chip
				sx={{ my: 2 }}
				label='La orden ya fue pagada'
				variant='outlined'
				color='success'
				icon={<CreditScoreOutlined />}
			/>
			{/* <Chip
				sx={{ my: 2 }}
				label='Pendiente de pago'
				variant='outlined'
				color='error'
				icon={<CreditCardOffOutlined />}
			/> */}
			<Grid container>
				<Grid item xs={12} sm={7}>
					<CartList />
				</Grid>
				<Grid item xs={12} sm={5}>
					<Card className='summary-card'>
						<CardContent>
							<Typography variant='h2'>Resumen (3 productos)</Typography>
							<Divider sx={{ my: 1 }} />
							<Box display='flex' justifyContent='end'>
								<NextLink href='/checkout/address' passHref>
									<Link underline='always'>Editar</Link>
								</NextLink>
							</Box>
							<Typography variant='subtitle1'>Dirección de entrega</Typography>
							<Typography>Fernando Herrera</Typography>
							<Typography>323 Algun lugar</Typography>
							<Typography>Smallvielle, CAL</Typography>
							<Typography>EEUU</Typography>
							<Typography>+156165166</Typography>
							<Divider sx={{ mt: 1 }} />
							<Box display='flex' justifyContent='end'>
								<NextLink href='/cart' passHref>
									<Link underline='always'>Editar</Link>
								</NextLink>
							</Box>
							<OrderSummary />
							<Box sx={{ mt: 3 }}>
								<h1>Pagar</h1>{' '}
							</Box>
							<Chip
								sx={{ my: 2 }}
								label='La orden ya fue pagada'
								variant='outlined'
								color='success'
								icon={<CreditScoreOutlined />}
							/>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};
export default OrderPage;
