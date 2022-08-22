import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { AdminNavbar } from '../admin';
import { SideMenu } from '../ui';

interface Props {
	children?: ReactNode;
	title: string;
	subtitle: string;
	icon?: JSX.Element;
}

export const AdminLayout = ({ children, title, subtitle, icon }: Props) => {
	return (
		<>
			<nav>
				<AdminNavbar />
			</nav>
			<SideMenu />

			<main
				style={{
					margin: '80px auto',
					maxWidth: '1140px',
					padding: '0px 30px',
				}}
			>
				<Box display='flex' flexDirection='column'>
					<Typography variant='h1' component='h1'>
						{icon} {title}
					</Typography>
					<Typography variant='h2' sx={{ mb: 1 }}>
						{subtitle}
					</Typography>
				</Box>
				<Box className='fadeIn'>{children}</Box>
			</main>
		</>
	);
};
