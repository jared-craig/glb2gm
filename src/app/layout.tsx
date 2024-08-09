import type { Metadata } from 'next';
import './globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import { Box, CssBaseline } from '@mui/material';
import MuiXLicense from '@/MuiXLicense';
import Header from './components/Header';

export const metadata: Metadata = {
  title: 'GLB2GM',
  description: 'GLB2 Helper',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <MuiXLicense />
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header />
            <Box
              component='main'
              sx={{
                flexGrow: 1,
                overflow: 'auto',
                m: 2,
              }}
            >
              {children}
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
