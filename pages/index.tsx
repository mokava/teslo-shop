import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import { ShopLayout } from '../components/layouts/ShopLayout';
import { ProductList } from '../components/products';
import { FullScreenLoading } from '../components/ui';
import { useProducts } from '../hooks';
import { IProduct } from '../interfaces/products';

const HomePage: NextPage = () => {
	const { products, isLoading } = useProducts('/products');

	return (
		<ShopLayout
			title={'Teslo-Shop - Home'}
			pageDescription={'Los mejores productos de Teslo están aquí'}
		>
			<Typography variant='h1' component='h1'>
				Tienda
			</Typography>
			<Typography variant='h2' sx={{ mb: 1 }}>
				Todos los productos
			</Typography>

			{isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
		</ShopLayout>
	);
};

export default HomePage;
