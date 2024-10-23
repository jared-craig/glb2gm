import type { Metadata } from 'next';
import './globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import { Box, CssBaseline, Typography } from '@mui/material';
import MuiXLicense from '@/MuiXLicense';
import HeaderBar from './components/HeaderBar';

import { Analytics } from '@vercel/analytics/react';

import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Suspense } from 'react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'GLB2GM',
  description: 'GLB2 Statistics and Analysis',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' translate='no'>
      <head>
        <link rel='icon' href='/favicon.ico' />
      </head>
      <UserProvider>
        <body>
          <MuiXLicense />
          <Analytics />
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <HeaderBar />
              <Suspense>
                <Box
                  component='main'
                  sx={{
                    flexGrow: 1,
                    overflow: 'auto',
                    m: 1,
                  }}
                >
                  {children}
                </Box>
                <Typography variant='caption' sx={{ position: 'fixed', bottom: '20px', right: '20px' }}>
                  <Link href={'https://www.patreon.com/MadKingCraig'} target='_blank' style={{ color: 'inherit', textDecoration: 'inherit' }}>
                    Support Me Through <strong>Patreon</strong>
                  </Link>
                </Typography>
              </Suspense>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </body>
      </UserProvider>
    </html>
  );
}
