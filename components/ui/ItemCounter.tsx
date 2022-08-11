import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';

interface Props {
	currentQuantity: number;
	updatedQuantity: (newQuantity: number) => void;
	maxQuantity: number;
}

export const ItemCounter = ({
	currentQuantity,
	updatedQuantity,
	maxQuantity,
}: Props) => {
	const addQuantity = () => {
		updatedQuantity(currentQuantity + 1);
	};

	const minusQuantity = () => {
		updatedQuantity(currentQuantity - 1);
	};

	return (
		<Box display='flex' alignItems='center'>
			<IconButton disabled={currentQuantity <= 1} onClick={minusQuantity}>
				<RemoveCircleOutline />
			</IconButton>
			<Typography sx={{ width: 40, textAlign: 'center' }}>
				{currentQuantity}
			</Typography>
			<IconButton
				disabled={currentQuantity >= maxQuantity}
				onClick={addQuantity}
			>
				<AddCircleOutline />
			</IconButton>
		</Box>
	);
};
