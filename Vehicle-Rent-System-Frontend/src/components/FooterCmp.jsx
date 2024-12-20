// src/components/FooterCmp.js

import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const FooterCmp = () => {
  const OpenEmailLink = () => {
    window.location.href = "mailto:onkargaikwadojg@gmail.com?subject=Inquiry&body=Hello, I would like to know more about your services."
  };
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#f26a5a', // You can change this to your theme color
        color: 'white',
        padding: '10px 0',
        position: 'fixed',
        bottom: 0,
        left: 0,
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="inherit">
        &copy; 2024 Vehicle Rent System (This is a dummy site created for testing purpose only)
      </Typography>
      <Box sx={{ marginTop: 1 }}>
        Contact:
        <Link href="#" onClick={OpenEmailLink} color="inherit" sx={{ marginLeft: 2 }}>
          onkargaikwadojg@gmail.com
        </Link>
        <Link color="inherit" sx={{ marginLeft: 2 }}>
          +91 7020409611
        </Link>
      </Box>
    </Box>
  );
};

export default FooterCmp;
