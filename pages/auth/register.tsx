import {
	Box,
	Button,
	Chip,
	Grid,
	Link,
	TextField,
	Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { AuthLayout } from '../../components/layouts';
import { useForm } from 'react-hook-form';
import { validations } from '../../utils';
import { useState, useContext } from 'react';
import tesloApi from '../../apis/tesloApi';
import { ErrorOutline } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context/auth/AuthContext';
import { getSession, signIn } from 'next-auth/react';
import { GetServerSideProps } from 'next';

type FormData = {
	name: string;
	email: string;
	password: string;
};

const RegisterPage = () => {
	const { registerUser } = useContext(AuthContext);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const onRegisterForm = async ({ name, email, password }: FormData) => {
		setShowError(false);
		const { hasError, message } = await registerUser(name, email, password);

		if (hasError) {
			setShowError(true);
			setErrorMessage(message!);
			setTimeout(() => setShowError(false), 3000);
			return;
		}

		// const destination = router.query.p?.toString() || '/';
		// router.replace(destination);

		await signIn('credentials', { email, password });
	};

	return (
		<AuthLayout title='Registrar'>
			<form onSubmit={handleSubmit(onRegisterForm)} noValidate>
				<Box sx={{ width: 350, padding: '10px 20px' }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography variant='h1' component='h1'>
								Crear cuenta
							</Typography>
							<Chip
								label='Revisa tus datos'
								color='error'
								icon={<ErrorOutline />}
								className='fadeIn'
								sx={{ display: showError ? 'flex' : 'none' }}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label='Nombre completo'
								variant='filled'
								fullWidth
								{...register('name', {
									required: 'Éste campo es requerido',
									minLength: { value: 2, message: 'Mínimo 2 caracteres' },
								})}
								error={!!errors.name}
								helperText={errors.name?.message}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								type='email'
								label='Correo'
								variant='filled'
								fullWidth
								{...register('email', {
									required: 'Éste campo es requerido',
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
									required: 'Éste campo es requerido',
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
								Registrar
							</Button>
						</Grid>
						<Grid item xs={12} display='flex' justifyContent='end'>
							<NextLink
								href={`/auth/login${
									router.query.p ? '?p=' + router.query.p.toString() : ''
								}`}
								passHref
							>
								<Link underline='always'>¿Ya tienes una cuenta?</Link>
							</NextLink>
						</Grid>
					</Grid>
				</Box>
			</form>
		</AuthLayout>
	);
};

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

export default RegisterPage;
