import { FC, useReducer, ReactNode } from 'react';
import { UiContext, uiReducer } from './';

interface Props {
	children?: ReactNode;
}

export interface UiState {
	isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UiState = {
	isMenuOpen: false,
};

export const UiProvider = ({ children }: Props) => {
	const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

	const toggleSideMenu = () => {
		dispatch({ type: '[UI] - ToggleMenu' });
	};

	return (
		<UiContext.Provider value={{ ...state, toggleSideMenu }}>
			{children}
		</UiContext.Provider>
	);
};
