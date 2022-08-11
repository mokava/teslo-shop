import {
	Grid,
	Card,
	CardActionArea,
	CardMedia,
	Box,
	Typography,
	Link,
	Chip,
} from '@mui/material';
import NextLink from 'next/link';

import { useMemo, useState } from 'react';
import { IProduct } from '../../interfaces/products';

interface Props {
	product: IProduct;
}
export const ProductCard = ({ product }: Props) => {
	const [isHovered, setIsHovered] = useState(false);
	const [isImageLoader, setIsImageLoader] = useState(false);

	const productImage = useMemo(() => {
		return isHovered
			? `/products/${product.images[1]}`
			: `/products/${product.images[0]}`;
	}, [isHovered, product.images]);

	return (
		<Grid
			item
			xs={6}
			sm={4}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<Card>
				<NextLink href={`/product/${product.slug}`} passHref prefetch={false}>
					<Link>
						<CardActionArea>
							{product.inStock === 0 && (
								<Chip
									color='primary'
									label='Sin stock'
									sx={{
										position: 'absolute',
										zIndex: 99,
										top: '10px',
										left: '10px',
									}}
								/>
							)}
							<CardMedia
								component='img'
								image={productImage}
								alt={product.title}
								className='fadeIn'
								onLoad={() => setIsImageLoader(true)}
							/>
						</CardActionArea>
					</Link>
				</NextLink>
			</Card>

			<Box
				sx={{ mt: 1, display: isImageLoader ? 'block' : 'none' }}
				className='fadeIn'
			>
				<Typography fontWeight={700}>{product.title}</Typography>
				<Typography fontWeight={500}>${product.price}</Typography>
			</Box>
		</Grid>
	);
};
