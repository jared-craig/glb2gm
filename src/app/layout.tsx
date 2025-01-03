import type { Metadata } from 'next';
import './globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import { Box, CssBaseline } from '@mui/material';
import MuiXLicense from '@/MuiXLicense';
import HeaderBar from './components/HeaderBar';

import { Analytics } from '@vercel/analytics/react';

import { Suspense } from 'react';

import { Auth0Provider } from '@auth0/nextjs-auth0';
import { auth0 } from './lib/auth0';

export const metadata: Metadata = {
  title: 'GLB2GM',
  description: 'GLB2 Tools, Statistics, and Analysis',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth0.getSession();

  return (
    <html lang='en' translate='no'>
      <head>
        <link rel='icon' href='/favicon.ico' />
      </head>
      <body>
        <Auth0Provider user={session?.user}>
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
              </Suspense>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </Auth0Provider>
      </body>
    </html>
  );
}
