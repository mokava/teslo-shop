import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';

const KidPage: NextPage = () => {
	const { products, isLoading } = useProducts('/products?gender=kid');

	return (
		<ShopLayout
			title={'Teslo-Shop - Kid'}
			pageDescription={'Los mejores productos de Teslo están aquí'}
		>
			<Typography variant='h1' component='h1'>
				Niños
			</Typography>
			<Typography variant='h2' sx={{ mb: 1 }}>
				Todos los productos
			</Typography>

			{isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
		</ShopLayout>
	);
};

export default KidPage;
