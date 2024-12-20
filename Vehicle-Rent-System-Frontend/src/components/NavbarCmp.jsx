import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Tabs, Tab } from '@mui/material';
import { Link } from 'react-router-dom';
import AcUnitOutlinedIcon from '@mui/icons-material/AcUnitOutlined';

const NavbarCmp = ({ page_count }) => {
  const OpenEmailLink = () => {
    window.location.href = "mailto:onkargaikwadojg@gmail.com?subject=Inquiry&body=Hello, I would like to know more about your services."
  };
  const GoToHomePage = () => {
    window.location.href = "/"
  };
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <AcUnitOutlinedIcon sx={{ fontSize: 30, marginRight: 1 }} />
        <Typography variant="h6" sx={{cursor:'pointer'}} onClick={GoToHomePage}>Vehical Rent System</Typography>
        <Tabs
          sx={{ marginLeft: "auto" }}
          value={page_count}
          // onChange={(e, val) => setValue(val)}
          textColor="inherit"
          indicatorColor="secondary"
        >
          <Tab label="Home" href='/' />
          <Tab label="Book Vehicle" href='/book-vehicle' />
          <Tab label="Contact" onClick={OpenEmailLink} />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default NavbarCmp;