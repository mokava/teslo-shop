import { Box, Typography } from '@mui/material';
import { ShopLayout } from '../components/layouts';

const Custom404Page = () => {
	return (
		<ShopLayout
			title='Página no encontrada'
			pageDescription='No hay nada que mostrar aquí '
		>
			<Box
				display='flex'
				justifyContent='center'
				alignItems='center'
				height='calc(100vh - 200px)'
				textAlign='center'
				sx={{ flexDirection: { xs: 'column', lg: 'row' } }}
			>
				<Typography variant='h1' component='h1' fontSize={80} fontWeight={200}>
					404 |
				</Typography>
				<Typography fontSize={30} marginLeft={2}>
					No encontramos ninguna coincidencia en ésta página
				</Typography>
			</Box>
		</ShopLayout>
	);
};
export default Custom404Page;
