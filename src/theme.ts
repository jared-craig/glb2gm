'use client';
import { Aldrich } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';
import { lime } from '@mui/material/colors';

const roboto = Aldrich({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    mode: 'dark',
    secondary: lime,
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          '& .MuiDataGrid-columnHeader:focus-within': { outline: 'none' },
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
        },
      },
    },
  },
});

export default theme;
