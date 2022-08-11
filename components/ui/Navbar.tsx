import NextLink from 'next/link';
import {
	AppBar,
	Badge,
	Box,
	Button,
	IconButton,
	Input,
	InputAdornment,
	InputProps,
	Link,
	Toolbar,
	Typography,
} from '@mui/material';
import {
	ClearOutlined,
	SearchOutlined,
	ShoppingCartOutlined,
} from '@mui/icons-material';
import router, { useRouter } from 'next/router';
import {
	MutableRefObject,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { UiContext } from '../../context';
import { CartContext } from '../../context/cart/CartContext';

export const Navbar = () => {
	const { pathname, push } = useRouter();

	const { numberOfItems } = useContext(CartContext);

	const { toggleSideMenu } = useContext(UiContext);

	const [searchTerm, setSearchTerm] = useState('');
	const [isSearchVisible, setIsSearchVisible] = useState(false);

	const onSearchTerm = () => {
		if (searchTerm.trim().length === 0) return;
		push(`/search/${searchTerm}`);
	};

	// const inputRef: MutableRefObject<InputProps> = useRef();

	// useEffect(() => {
	// 	inputRef.current.focus();
	// }, [isSearchVisible]);

	return (
		<AppBar>
			<Toolbar>
				<NextLink href='/' passHref>
					<Link display='flex' alignItems='center'>
						<Typography variant='h6'>Teslo |</Typography>
						<Typography sx={{ ml: 0.5 }}>Shop</Typography>
					</Link>
				</NextLink>
				<Box flex={1}></Box>{' '}
				<Box
					className='fadeIn'
					sx={{
						display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' },
					}}
				>
					<NextLink href='/category/men' passHref>
						<Link>
							<Button color={pathname === '/category/men' ? 'primary' : 'info'}>
								Hombres
							</Button>
						</Link>
					</NextLink>
					<NextLink href='/category/women' passHref>
						<Link>
							<Button
								color={pathname === '/category/women' ? 'primary' : 'info'}
							>
								Mujeres
							</Button>
						</Link>
					</NextLink>
					<NextLink href='/category/kid' passHref>
						<Link>
							<Button color={pathname === '/category/kid' ? 'primary' : 'info'}>
								Niños
							</Button>
						</Link>
					</NextLink>
				</Box>
				<Box flex={1}></Box>
				{/* <IconButton>
					<SearchOutlined />
				</IconButton> */}
				{isSearchVisible ? (
					<Input
						sx={{
							display: { xs: 'none', sm: 'flex' },
						}}
						// ref={inputRef}
						className='fadeIn'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						onKeyUp={(e) => e.key === 'Enter' && onSearchTerm()}
						type='text'
						placeholder='Buscar...'
						endAdornment={
							<InputAdornment position='end'>
								<IconButton onClick={() => setIsSearchVisible(false)}>
									<ClearOutlined />
								</IconButton>
							</InputAdornment>
						}
					/>
				) : (
					<IconButton
						className='fadeIn'
						sx={{ display: { xs: 'none', sm: 'flex' } }}
						onClick={() => setIsSearchVisible(true)}
					>
						<SearchOutlined />
					</IconButton>
				)}
				<IconButton
					className='fadeIn'
					sx={{ display: { xs: 'flex', sm: 'none' } }}
					onClick={toggleSideMenu}
				>
					<SearchOutlined />
				</IconButton>
				<NextLink href='/cart' passHref>
					<Link>
						<IconButton>
							<Badge badgeContent={numberOfItems} color='secondary'>
								<ShoppingCartOutlined />
							</Badge>
						</IconButton>
					</Link>
				</NextLink>
				<Button onClick={toggleSideMenu}>Menú</Button>
			</Toolbar>
		</AppBar>
	);
};
