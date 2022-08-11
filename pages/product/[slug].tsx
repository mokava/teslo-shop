import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { ProductSlideshow, SizeSelector } from '../../components/products';
import { ItemCounter } from '../../components/ui';
import { IProduct, ISize } from '../../interfaces/products';
import { GetStaticProps, GetStaticPaths } from 'next';
import { dbProducts } from '../../database';
import { useContext, useState } from 'react';
import { ICartProduct } from '../../interfaces';
import { CartContext } from '../../context/cart/CartContext';
import { useRouter } from 'next/router';

interface Props {
	product: IProduct;
	slug: string;
}

const SlugPage = ({ product, slug }: Props) => {
	const { addProduct } = useContext(CartContext);

	const router = useRouter();

	const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
		_id: product._id,
		image: product.images[0],
		inStock: product.inStock,
		price: product.price,
		size: undefined,
		slug: product.slug,
		title: product.title,
		gender: product.gender,
		quantity: 1,
	});

	const onSelectedSize = (size: ISize) => {
		setTempCartProduct((currentProduct) => ({
			...currentProduct,
			size,
		}));
	};

	const updatedQuantity = (newQuantity: number) => {
		setTempCartProduct((currentProduct) => ({
			...currentProduct,
			quantity: newQuantity,
		}));
	};

	const AddToCart = () => {
		addProduct(tempCartProduct);
		router.push('/cart');
	};

	return (
		<ShopLayout title={product.title} pageDescription={product.description}>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={7}>
					<ProductSlideshow images={product.images} />
				</Grid>
				<Grid item xs={12} sm={5}>
					<Box display='flex' flexDirection='column'>
						<Typography variant='h1' component='h1'>
							{product.title}
						</Typography>
						<Typography variant='subtitle1' component='h2'>
							${product.price}
						</Typography>
						<Box sx={{ my: 2 }}>
							<Typography variant='subtitle2'>Cantidad</Typography>
							<ItemCounter
								currentQuantity={
									tempCartProduct.quantity === 0 ? 0 : tempCartProduct.quantity
								}
								updatedQuantity={updatedQuantity}
								maxQuantity={tempCartProduct.inStock}
							/>
							<SizeSelector
								selectedSize={tempCartProduct.size}
								sizes={product.sizes}
								onSelectedSize={onSelectedSize}
							/>
						</Box>
						{product.inStock ? (
							tempCartProduct.size ? (
								<Button
									color='secondary'
									className='circular-btn'
									onClick={AddToCart}
								>
									Agregar al carrito
								</Button>
							) : (
								<Chip
									label='Elige una talla'
									color='error'
									variant='outlined'
								/>
							)
						) : (
							<Chip
								label='No hay disponibles'
								color='error'
								variant='outlined'
							/>
						)}
						<Box sx={{ mt: 3 }}>
							<Typography variant='subtitle2'>Descripción</Typography>
							<Typography variant='body2'>{product.description}</Typography>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
export const getStaticPaths: GetStaticPaths = async () => {
	const slugs = await dbProducts.getAllProductSlugs(); // your fetch function here

	return {
		paths: slugs.map(({ slug }) => ({
			params: {
				slug,
			},
		})),

		fallback: 'blocking',
	};
};

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.
export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { slug = '' } = params as { slug: string };
	const product = await dbProducts.getProductBySlug(slug); // your fetch function here

	if (!product) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	return {
		props: {
			product,
		},
		revalidate: 60 * 60 * 24,
	};
};

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
// 	q(ctx);
// 	const { params } = ctx;
// 	const { slug = '' } = params as { slug: string };
// 	const product = await dbProducts.getProductBySlug(slug); // your fetch function here

// 	if (!product) {
// 		return {
// 			redirect: {
// 				destination: '/',
// 				permanent: false,
// 			},
// 		};
// 	}

// 	return {
// 		props: {
// 			product,
// 		},
// 	};
// };

export default SlugPage;
