import { RemoveShoppingCartOutlined } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import { ShopLayout } from '../../components/layouts/ShopLayout';

const EmptyPage = () => {
	return (
		<ShopLayout
			title='Carrito vacío'
			pageDescription='No hay artículos en el carrito'
		>
			<Box
				display='flex'
				justifyContent='center'
				alignItems='center'
				height='calc(100vh - 200px)'
				textAlign='center'
				sx={{ flexDirection: { xs: 'column', lg: 'row' } }}
			>
				<RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
				<Box display='flex' flexDirection='column' alignItems='center'>
					<Typography marginLeft='2px'>Su carrito está vacío</Typography>
					<NextLink href='/' passHref>
						<Link typography='h4' color='secondary'>
							Regresar
						</Link>
					</NextLink>
				</Box>
			</Box>
		</ShopLayout>
	);
};
export default EmptyPage;
