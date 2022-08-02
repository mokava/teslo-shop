import { Grid } from '@mui/material';
import { ReactNode } from 'react';
import { IProduct } from '../../interfaces/products';
import { ProductCard } from './ProductCard';

interface Props {
	products: IProduct[];
}

export const ProductList = ({ products }: Props) => {
	return (
		<Grid container spacing={4}>
			{products.map((product) => (
				// <ProductCard product={product} key={product._id} />
				<ProductCard product={product} key={product.slug} />
			))}
		</Grid>
	);
};
