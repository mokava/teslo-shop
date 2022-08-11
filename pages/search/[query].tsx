import { Box, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';

interface Props {
	products: IProduct[];
	foundProducts: boolean;
	query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
	return (
		<ShopLayout
			title={'Teslo-Shop - Search'}
			pageDescription={'Los mejores productos de Teslo están aquí'}
		>
			<Typography variant='h1' component='h1'>
				Buscar producto
			</Typography>
			{foundProducts ? (
				<Box display='flex'>
					<Typography variant='h2' sx={{ mb: 1 }}>
						Encontramos éstos productos con:
					</Typography>
					<Typography
						variant='h2'
						sx={{ ml: 1 }}
						color='secondary'
						textTransform='capitalize'
					>
						{query}
					</Typography>
				</Box>
			) : (
				<>
					<Box display='flex'>
						<Typography variant='h2' sx={{ mb: 1 }}>
							No encontramos productos con:
						</Typography>
						<Typography
							variant='h2'
							sx={{ ml: 1 }}
							color='secondary'
							textTransform='capitalize'
						>
							{query}
						</Typography>
					</Box>
					<Typography variant='h2' sx={{ mb: 1 }}>
						Te sugerimos éstos productos
					</Typography>
				</>
			)}
			<ProductList products={products} />
		</ShopLayout>
	);
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
import { GetServerSideProps } from 'next';
import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const { query = '' } = params as { query: string };

	if (query.length === 0) {
		return {
			redirect: {
				destination: '/',
				permanent: true,
			},
		};
	}

	let products = await dbProducts.getProductsByTerm(query);

	const foundProducts = products.length > 0;

	if (!foundProducts) {
		products = await dbProducts.getAllProducts();
	}

	return {
		props: {
			products,
			foundProducts,
			query,
		},
	};
};

export default SearchPage;
