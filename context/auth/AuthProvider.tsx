import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useReducer, ReactNode, useEffect } from 'react';
import { tesloApi } from '../../apis';
import { IUser } from '../../interfaces';
import { AuthContext } from './AuthContext';
import { authReducer } from './authReducer';
import { useSession, signOut } from 'next-auth/react';

export interface AuthState {
	isLoggedIn: boolean;
	user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
	isLoggedIn: false,
	user: undefined,
};

interface Props {
	children?: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
	const { data, status } = useSession();

	const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
	const router = useRouter();

	useEffect(() => {
		if (status === 'authenticated') {
			console.log({ user: data?.user });
			dispatch({ type: '[AUTH] - Login', payload: data?.user as IUser });
		}
	}, [data?.user, status]);

	// useEffect(() => {
	// 	checkToken();
	// }, []);

	const checkToken = async (): Promise<void> => {
		if (!Cookies.get('token')) return;

		try {
			const { data } = await tesloApi.get('/user/validate-token');
			const { token, user } = data;
			Cookies.set('token', token);
			dispatch({ type: '[AUTH] - Login', payload: user });
		} catch (error) {
			Cookies.remove('token');
		}
	};

	const loginUser = async (
		email: string,
		password: string
	): Promise<boolean> => {
		try {
			const { data } = await tesloApi.post('/user/login', { email, password });
			const { token, user } = data;
			Cookies.set('token', token);
			dispatch({ type: '[AUTH] - Login', payload: user });
			return true;
		} catch (error) {
			return false;
		}
	};

	const registerUser = async (
		name: string,
		email: string,
		password: string
	): Promise<{ hasError: boolean; message?: string }> => {
		try {
			const { data } = await tesloApi.post('/user/register', {
				name,
				email,
				password,
			});
			const { token, user } = data;
			Cookies.set('token', token);
			dispatch({ type: '[AUTH] - Login', payload: user });
			return {
				hasError: false,
			};
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const err = error as AxiosError;
				return {
					hasError: true,
					message: err.message,
				};
			}

			return {
				hasError: true,
				message: 'No se pudo crear el usuario. Intente de nuevo.',
			};
		}
	};

	const logout = () => {
		// Cookies.remove('token');
		Cookies.remove('cart');

		Cookies.remove('firstName');
		Cookies.remove('lastName');
		Cookies.remove('address');
		Cookies.remove('address2');
		Cookies.remove('zip');
		Cookies.remove('city');
		Cookies.remove('country');
		Cookies.remove('phone');
		signOut();
		// router.reload();
	};

	return (
		<AuthContext.Provider
			value={{ ...state, loginUser, registerUser, checkToken, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};
