import { CartContext } from './CartContext';
import { FC, PropsWithChildren, useReducer, ReactNode, useEffect } from 'react';
import { ICartProduct } from '../../interfaces/cart';
import { cartReducer } from './cartReducer';
import Cookie from 'js-cookie';
import Cookies from 'js-cookie';
import { ShippingAddress } from '../../interfaces';
import tesloApi from '../../apis/tesloApi';
import { IOrder } from '../../interfaces/order';
import axios from 'axios';

interface Props {
	children?: ReactNode;
}

export interface CartState {
	isLoaded: boolean;
	cart: ICartProduct[];
	numberOfItems: number;
	subTotal: number;
	tax: number;
	total: number;
	shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE = {
	isLoaded: false,
	cart: [],
	numberOfItems: 0,
	subTotal: 0,
	tax: 0,
	total: 0,
	shippingAddress: undefined,
};

export const CartProvider = ({ children }: Props) => {
	const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

	useEffect(() => {
		try {
			const cookieCart = JSON.parse(Cookie.get('cart')!) || [];

			dispatch({
				type: '[Cart] - LoadCart from cookies | storage',
				payload: cookieCart,
			});
		} catch (error) {
			dispatch({
				type: '[Cart] - LoadCart from cookies | storage',
				payload: [],
			});
		}
	}, []);

	useEffect(() => {
		if (Cookies.get('firstName')) {
			const shippingAddress = {
				firstName: Cookies.get('firstName') || '',
				lastName: Cookies.get('lastName') || '',
				address: Cookies.get('address') || '',
				address2: Cookies.get('address2') || '',
				zip: Cookies.get('zip') || '',
				city: Cookies.get('city') || '',
				country: Cookies.get('country') || '',
				phone: Cookies.get('phone') || '',
			};
			if (!shippingAddress) return;
			dispatch({
				type: '[Cart] - Load address from cookies',
				payload: shippingAddress,
			});
		}
	}, []);

	useEffect(() => {
		// Cookie.set('cart', JSON.stringify(state.cart));
		if (state.cart.length > 0) Cookie.set('cart', JSON.stringify(state.cart));
	}, [state.cart]);

	useEffect(() => {
		const numberOfItems = state.cart.reduce(
			(prev, current) => current.quantity + prev,
			0
		);

		const subTotal = state.cart.reduce(
			(prev, current) => current.price * current.quantity + prev,
			0
		);

		const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE) || 0;

		const orderSummary = {
			numberOfItems,
			subTotal,
			tax: taxRate * subTotal,
			total: subTotal * (taxRate + 1),
		};

		dispatch({ type: '[Cart] - Update Order Summary', payload: orderSummary });
	}, [state.cart]);

	const addProduct = (product: ICartProduct) => {
		const productInCart = state.cart.some(
			(p) => p._id === product._id && p.size === product.size
		);
		if (!productInCart)
			return dispatch({
				type: '[Cart] - Update products in Cart',
				payload: [...state.cart, product],
			});

		const updatedProducts = state.cart.map((p) => {
			if (p._id !== product._id) return p;
			if (p.size !== product.size) return p;

			p.quantity += product.quantity;
			return p;
		});
		return dispatch({
			type: '[Cart] - Update products in Cart',
			payload: updatedProducts,
		});
	};

	const updateCartQuantity = (product: ICartProduct) => {
		dispatch({ type: '[Cart] - Change product quantity', payload: product });
	};

	const removeCartProduct = (product: ICartProduct) => {
		dispatch({ type: '[Cart] - Remove product in Cart', payload: product });
	};

	const updateAddress = (address: ShippingAddress) => {
		Cookies.set('firstName', address.firstName);
		Cookies.set('lastName', address.lastName);
		Cookies.set('address', address.address);
		Cookies.set('address2', address.address2 || '');
		Cookies.set('zip', address.zip);
		Cookies.set('city', address.city);
		Cookies.set('country', address.country);
		Cookies.set('phone', address.phone);

		dispatch({ type: '[Cart] - Update address', payload: address });
	};

	const createOrder = async (): Promise<{
		hasError: boolean;
		message: string;
	}> => {
		if (!state.shippingAddress) {
			throw new Error('No hay dirección de entrega');
		}

		const body: IOrder = {
			orderItems: state.cart.map((p) => ({
				...p,
				size: p.size!,
			})),
			shippingAddress: state.shippingAddress,
			numberOfItems: state.numberOfItems,
			subTotal: state.subTotal,
			tax: state.tax,
			total: state.total,
			isPaid: false,
		};

		try {
			const { data } = await tesloApi.post<IOrder>('/orders', body);

			dispatch({ type: '[Cart] - Order complete' });
			Cookies.remove('cart');

			return {
				hasError: false,
				message: data._id!,
			};
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const { message } = error.response?.data as { message: string };
				return {
					hasError: true,
					message,
				};
			}
			return {
				hasError: true,
				message: 'Error no controlado, hable con el administrador',
			};
		}
	};

	return (
		<CartContext.Provider
			value={{
				...state,
				addProduct,
				updateCartQuantity,
				removeCartProduct,
				updateAddress,
				createOrder,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};
