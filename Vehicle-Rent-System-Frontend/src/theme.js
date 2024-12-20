// src/theme.js

import { createTheme } from '@mui/material/styles';

// Define the custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#ee402a', // Custom primary color (e.g., Orange)
    },
    secondary: {
      main: '#ee402a', // Custom secondary color (e.g., Green)
    },
  },
//   typography: {
//     fontFamily: '"Roboto", sans-serif',
//     h1: {
//       fontWeight: 700,
//       fontSize: '2rem',
//     },
//   },
//   spacing: 8, // Default spacing multiplier
//   components: {
//     MuiAppBar: {
//       styleOverrides: {
//         root: {
//           backgroundColor: '#ff5722', // Custom AppBar color
//         },
//       },
//     },
//   },
});

export default theme;
