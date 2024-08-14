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
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '../assets/logo-no-background.png';
import Link from 'next/link';

const pages = ['All Stars', 'Passing Stats', 'Rushing Stats', 'Receiving Stats'];

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
      case 'Passing Stats':
        router.push('/stats/passing');
        break;
      case 'Rushing Stats':
        router.push('/stats/rushing');
        break;
      case 'Receiving Stats':
        router.push('/stats/receiving');
        break;
    }
  };

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          {/* Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
            <Image src={logo} width={50} height={50} alt='logo' />
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mx: 2 }}>
            <Typography variant='h4' sx={{ lineHeight: 1.5 }}>
              <Link href='/' style={{ color: 'inherit', textDecoration: 'inherit' }}>
                GLB2GM
              </Link>
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button key={page} onClick={() => navigateToPage(page)} sx={{ my: 2, color: 'white', display: 'block' }}>
                {page}
              </Button>
            ))}
          </Box>

          {/* Mobile */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1, justifyContent: 'flex-start' }}>
            <Image src={logo} width={40} height={40} alt='logo' />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1, justifyContent: 'center' }}>
            <Typography variant='h4' sx={{ lineHeight: 1.5 }}>
              <Link href='/' style={{ color: 'inherit', textDecoration: 'inherit' }}>
                GLB2GM
              </Link>
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1, justifyContent: 'flex-end' }}>
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
                display: { xs: 'block', md: 'none' },
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
