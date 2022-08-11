import {
	Box,
	Button,
	FormControl,
	FormHelperText,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from '@mui/material';
import { ShopLayout } from '../../components/layouts/ShopLayout';

import { GetServerSideProps } from 'next';
import { isValidToken } from '../../utils/jwt';
import { countries, jwt } from '../../utils';
import { Controller, useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { CartContext } from '../../context/cart/CartContext';

type FormData = {
	firstName: string;
	lastName: string;
	address: string;
	address2: string;
	zip: string;
	city: string;
	country: string;
	phone: string;
};

const getAddressFromCookies = (): FormData => {
	return {
		firstName: Cookies.get('firstName') || '',
		lastName: Cookies.get('lastName') || '',
		address: Cookies.get('address') || '',
		address2: Cookies.get('address2') || '',
		zip: Cookies.get('zip') || '',
		city: Cookies.get('city') || '',
		country: Cookies.get('country') || '',
		phone: Cookies.get('phone') || '',
	};
};

const AddressPage = () => {
	const router = useRouter();
	const { updateAddress } = useContext(CartContext);

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FormData>({
		defaultValues: {
			firstName: '',
			lastName: '',
			address: '',
			address2: '',
			zip: '',
			city: '',
			country: countries[0].code,
			phone: '',
		},
	});

	useEffect(() => {
		reset(getAddressFromCookies());
	}, [reset]);

	const onSubmitAddress = (data: FormData) => {
		updateAddress(data);

		router.push('/checkout/summary');
	};

	return (
		<ShopLayout
			title='Dirección'
			pageDescription='Confirmar dirección del destino'
		>
			<form onSubmit={handleSubmit(onSubmitAddress)}>
				<Typography variant='h1' component='h1'>
					Dirección
				</Typography>
				<Grid container spacing={2} sx={{ mt: 2 }}>
					<Grid item xs={12} sm={6}>
						<TextField
							label='Nombre'
							variant='filled'
							fullWidth
							{...register('firstName', {
								required: 'Este campo es requerido',
								minLength: { value: 2, message: 'Mínimo 2 caracteres' },
							})}
							error={!!errors.firstName}
							helperText={errors.firstName?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label='Apellido'
							variant='filled'
							fullWidth
							{...register('lastName', {
								required: 'Este campo es requerido',
								minLength: { value: 2, message: 'Mínimo 2 caracteres' },
							})}
							error={!!errors.lastName}
							helperText={errors.lastName?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label='Dirección'
							variant='filled'
							fullWidth
							{...register('address', {
								required: 'Este campo es requerido',
								minLength: { value: 2, message: 'Mínimo 2 caracteres' },
							})}
							error={!!errors.address}
							helperText={errors.address?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label='Dirección 2 (opcional)'
							variant='filled'
							fullWidth
							{...register('address2')}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label='Código postal'
							variant='filled'
							fullWidth
							{...register('zip', {
								required: 'Este campo es requerido',
							})}
							error={!!errors.zip}
							helperText={errors.zip?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label='Ciudad'
							variant='filled'
							fullWidth
							{...register('city', {
								required: 'Este campo es requerido',
								minLength: { value: 2, message: 'Mínimo 2 caracteres' },
							})}
							error={!!errors.city}
							helperText={errors.city?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Controller
							name='country'
							control={control}
							defaultValue={''}
							render={({ field }) => (
								<FormControl fullWidth error={!!errors.country}>
									<InputLabel>Country</InputLabel>
									<Select {...field} label='Country'>
										{countries.map((country) => (
											<MenuItem value={country.code} key={country.code}>
												{country.name}
											</MenuItem>
										))}
									</Select>
									<FormHelperText>{errors.country?.message}</FormHelperText>
								</FormControl>
							)}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label='Teléfono'
							variant='filled'
							fullWidth
							{...register('phone', {
								required: 'Este campo es requerido',
								minLength: { value: 2, message: 'Mínimo 2 caracteres' },
							})}
							error={!!errors.phone}
							helperText={errors.phone?.message}
						/>
					</Grid>
				</Grid>
				<Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
					<Button
						type='submit'
						color='secondary'
						className='circular-btn'
						size='large'
					>
						Revisar pedido
					</Button>
				</Box>
			</form>
		</ShopLayout>
	);
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
// 	const { token = '' } = req.cookies;
// 	let isValidToken = false;

// 	try {
// 		await jwt.isValidToken(token);
// 		isValidToken = true;
// 	} catch (error) {
// 		isValidToken = false;
// 	}

// 	if (!isValidToken) {
// 		return {
// 			redirect: {
// 				destination: '/auth/login?p=/checkout/address',
// 				permanent: false,
// 			},
// 		};
// 	}

// 	return {
// 		props: {},
// 	};
// };

export default AddressPage;
