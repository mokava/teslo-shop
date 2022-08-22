import {
	Box,
	Button,
	Chip,
	Divider,
	Grid,
	Link,
	TextField,
	Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { AuthLayout } from '../../components/layouts';
import { validations } from '../../utils';
import tesloApi from '../../apis/tesloApi';
import { ErrorOutline } from '@mui/icons-material';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/auth/AuthContext';
import { useRouter } from 'next/router';
import { getSession, signIn, getProviders } from 'next-auth/react';

type FormData = {
	email: string;
	password: string;
};

const LoginPage = () => {
	// const { loginUser } = useContext(AuthContext);

	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const [showError, setShowError] = useState(false);

	const [providers, setProviders] = useState<any>({});

	useEffect(() => {
		getProviders().then((prov) => {
			setProviders(prov);
		});
	}, []);

	const onLoginUser = async ({ email, password }: FormData) => {
		setShowError(false);
		signIn('credentials', { email, password });
		// 	const isValidUser = await loginUser(email, password);

		// 	if (!isValidUser) {
		// 		setShowError(true);
		// 		setTimeout(() => {
		// 			setShowError(false);
		// 		}, 3000);
		// 	}
		// 	const destination = router.query.p?.toString() || '/';
		// 	router.replace(destination);
	};

	return (
		<AuthLayout title='Ingresar'>
			<form onSubmit={handleSubmit(onLoginUser)} noValidate>
				<Box sx={{ width: 350, padding: '10px 20px' }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography variant='h1' component='h1'>
								Ingresar sesión
							</Typography>
							<Chip
								label='No reconocemos ese usuario ó contraseña'
								color='error'
								icon={<ErrorOutline />}
								className='fadeIn'
								sx={{ display: showError ? 'flex' : 'none' }}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								type='email'
								label='Correo'
								variant='filled'
								fullWidth
								{...register('email', {
									required: 'Este campo es requerido',
									validate: validations.isEmail,
								})}
								error={!!errors.email}
								helperText={errors.email?.message}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label='Contraseña'
								type='password'
								variant='filled'
								fullWidth
								{...register('password', {
									required: 'Este campo es requerido',
									minLength: { value: 6, message: 'Mínimo 6 caracteres' },
								})}
								error={!!errors.password}
								helperText={errors.password?.message}
							/>
						</Grid>
						<Grid item xs={12}>
							<Button
								type='submit'
								color='secondary'
								className='circular-btn'
								size='large'
								fullWidth
							>
								Ingresar
							</Button>
						</Grid>
						<Grid item xs={12} display='flex' justifyContent='end'>
							<NextLink
								href={`/auth/register${
									router.query.p ? '?p=' + router.query.p.toString() : ''
								}`}
								passHref
							>
								<Link underline='always'>¿No tienes cuenta?</Link>
							</NextLink>
						</Grid>
						<Grid
							item
							xs={12}
							display='flex'
							justifyContent='end'
							flexDirection='column'
						>
							<Divider sx={{ width: '100%', mb: 2 }} />
							{Object.values(providers).map((provider: any) => {
								if (provider.id === 'credentials')
									return <div key='credentials'></div>;
								return (
									<Button
										key={provider.id}
										variant='outlined'
										fullWidth
										color='primary'
										sx={{ mb: 1 }}
										onClick={() => signIn(provider.id)}
									>
										{provider.name}
									</Button>
								);
							})}
						</Grid>
					</Grid>
				</Box>
			</form>
		</AuthLayout>
	);
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query,
}) => {
	const session = await getSession({ req });
	// console.log({ session });

	const { p = '/' } = query;

	if (session) {
		return {
			redirect: {
				destination: p.toString(),
				permanent: false,
			},
		};
	}

	return {
		props: {},
	};
};

export default LoginPage;
