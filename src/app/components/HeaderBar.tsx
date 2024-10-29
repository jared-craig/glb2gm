'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '../assets/logo-no-background.png';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Button, Skeleton } from '@mui/material';

const pages = ['All Stars', 'Player Builder', 'Player Optimizer', 'Player Templates', 'Player Stats', 'Team Rankings', 'Matchup', 'Team Builder'];

function HeaderBar() {
  const router = useRouter();
  const { user, error, isLoading } = useUser();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const navigateToPage = (page: string) => {
    handleCloseNavMenu();
    switch (page) {
      case 'All Stars':
        router.push('/all-stars');
        break;
      case 'Player Builder':
        router.push('/player-builder');
        break;
      case 'Player Optimizer':
        router.push('/player-optimizer');
        break;
      case 'Player Templates':
        router.push('/player-templates');
        break;
      case 'Player Stats':
        router.push('/stats');
        break;
      case 'Team Rankings':
        router.push('/rankings');
        break;
      case 'Matchup':
        router.push('/matchup');
        break;
      case 'Team Builder':
        router.push('/team-builder');
        break;
    }
  };

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <IconButton size='large' aria-label='glb2gm menu' aria-controls='menu-appbar' aria-haspopup='true' onClick={handleOpenNavMenu} color='inherit'>
            <MenuIcon />
          </IconButton>
          <Menu
            id='menu-appbar'
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: 'block',
            }}
          >
            {pages.map((page) => (
              <MenuItem key={page} onClick={() => navigateToPage(page)}>
                <Typography textAlign='center'>{page}</Typography>
              </MenuItem>
            ))}
          </Menu>
          <Box sx={{ display: 'flex', ml: 1, mr: 2 }}>
            <Image src={logo} width={40} height={40} alt='logo' priority={true} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant='h4' sx={{ lineHeight: 1.5, pt: 0.4 }}>
              <Link href='/' style={{ color: 'inherit', textDecoration: 'inherit' }}>
                GLB2GM
              </Link>
            </Typography>
          </Box>
          {user ? (
            <Button href='/api/auth/logout'>Logout</Button>
          ) : isLoading ? (
            <Typography>
              <Skeleton width={60} />
            </Typography>
          ) : (
            <Button href='/api/auth/login'>Login</Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default HeaderBar;
