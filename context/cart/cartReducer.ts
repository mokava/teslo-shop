import { ICartProduct } from '../../interfaces';
import { CartState, ShippingAddress } from './';

type CartActionType =
	| {
			type: '[Cart] - LoadCart from cookies | storage';
			payload: ICartProduct[];
	  }
	| { type: '[Cart] - Update products in Cart'; payload: ICartProduct[] }
	| { type: '[Cart] - Change product quantity'; payload: ICartProduct }
	| { type: '[Cart] - Remove product in Cart'; payload: ICartProduct }
	| { type: '[Cart] - Load address from cookies'; payload: ShippingAddress }
	| { type: '[Cart] - Update address'; payload: ShippingAddress }
	| {
			type: '[Cart] - Update Order Summary';
			payload: {
				numberOfItems: number;
				subTotal: number;
				tax: number;
				total: number;
			};
	  };

export const cartReducer = (state: CartState, action: CartActionType) => {
	switch (action.type) {
		case '[Cart] - LoadCart from cookies | storage':
			return {
				...state,
				isLoaded: true,
				cart: [...action.payload],
			};

		case '[Cart] - Update products in Cart':
			return {
				...state,
				cart: [...action.payload],
			};

		case '[Cart] - Change product quantity':
			return {
				...state,
				cart: state.cart.map((product) => {
					if (product._id !== action.payload._id) return product;
					if (product.size !== action.payload.size) return product;
					return action.payload;
				}),
			};

		case '[Cart] - Remove product in Cart':
			return {
				...state,
				cart: state.cart.filter(
					(p) =>
						!(p._id === action.payload._id && p.size === action.payload.size)
				),
			};

		case '[Cart] - Update Order Summary':
			return {
				...state,
				...action.payload,
			};

		case '[Cart] - Load address from cookies':
		case '[Cart] - Update address':
			return {
				...state,
				shippingAddress: action.payload,
			};

		default:
			return state;
	}
};
