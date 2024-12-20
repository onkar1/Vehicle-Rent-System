import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import theme from './theme'; // Import the custom theme
import { ThemeProvider } from '@mui/material';
import HomePage from './components/HomePage'; // Import the HomePage component
import FooterCmp from './components/FooterCmp'
import BookVehicle from './components/BookVehicle';
import NavbarCmp from './components/NavbarCmp';

function App() {
  const [pageCount, setPageCount] = useState(0)

  return (
    <ThemeProvider theme={theme}>
      <NavbarCmp page_count={pageCount}/>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage setPageCount={setPageCount}/>} />
          <Route path="/book-vehicle" element={<BookVehicle setPageCount={setPageCount}/>} />
        </Routes>
      </Router>
      <FooterCmp />
    </ThemeProvider>
  )
}

export default App
