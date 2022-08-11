import {
	Box,
	Button,
	CardActionArea,
	CardMedia,
	Grid,
	Link,
	Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { ItemCounter } from '../ui';
import { useContext } from 'react';
import { CartContext } from '../../context/cart/CartContext';
import { ICartProduct } from '../../interfaces';

interface Props {
	editable?: boolean;
}

export const CartList = ({ editable = false }: Props) => {
	const { cart, updateCartQuantity, removeCartProduct } =
		useContext(CartContext);

	const updatedQuantity = (product: ICartProduct, newQuantity: number) => {
		product.quantity = newQuantity;
		updateCartQuantity(product);
	};

	const removeProduct = (product: ICartProduct) => {
		removeCartProduct(product);
	};

	return (
		<>
			{cart.map((product) => (
				<Grid
					container
					spacing={2}
					sx={{ mb: 1 }}
					key={product.slug + product.size}
				>
					<Grid item xs={3}>
						<NextLink href={`/product/${product.slug}`} passHref>
							<Link>
								<CardActionArea>
									<CardMedia
										image={`/products/${product.image}`}
										component='img'
										sx={{ borderRadius: '5px' }}
									/>
								</CardActionArea>
							</Link>
						</NextLink>
					</Grid>
					<Grid item xs={7}>
						<Box display='flex' flexDirection='column'>
							<Typography variant='body1'>{product.title}</Typography>
							<Typography variant='body1'>
								Talle: <strong>{product.size}</strong>
							</Typography>
							{editable ? (
								<ItemCounter
									currentQuantity={product.quantity}
									updatedQuantity={(value) => updatedQuantity(product, value)}
									maxQuantity={product.inStock}
								/>
							) : (
								<Typography variant='h5'>
									{product.quantity}{' '}
									{product.quantity > 1 ? 'productos' : 'producto'}
								</Typography>
							)}
						</Box>
					</Grid>
					<Grid
						item
						xs={2}
						display='flex'
						alignItems='center'
						flexDirection='column'
					>
						<Typography variant='subtitle1'>${product.price}</Typography>
						{editable && (
							<Button
								onClick={() => removeProduct(product)}
								variant='text'
								color='secondary'
							>
								Remover
							</Button>
						)}
					</Grid>
				</Grid>
			))}
		</>
	);
};
