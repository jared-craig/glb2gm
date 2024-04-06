import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Container } from '@mui/material';
import { Providers } from './Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GLB2 GM',
  description: 'Tools for Goal Line Blitz 2',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang='en'>
        <body className={inter.className}>
          <Container>{children}</Container>
        </body>
      </html>
    </Providers>
  );
}
