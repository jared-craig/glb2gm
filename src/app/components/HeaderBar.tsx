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

const pages = ['All Stars', 'Player Builder', 'Player Stats', 'Team Rankings'];

function HeaderBar() {
  const router = useRouter();

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
      case 'Player Stats':
        router.push('/stats');
        break;
      case 'Team Rankings':
        router.push('/rankings');
    }
  };

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-start' }}>
            <Image src={logo} width={40} height={40} alt='logo' priority={true} />
          </Box>
          <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
            <Typography variant='h4' sx={{ lineHeight: 1.5 }}>
              <Link href='/' style={{ color: 'inherit', textDecoration: 'inherit' }}>
                GLB2GM
              </Link>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
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
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default HeaderBar;
