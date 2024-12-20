// src/components/HomePage.js

import React, { useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom'; // For navigation (if needed)
import { Box, Grid, Card, CardContent, CardMedia, Typography, Button, CircularProgress, Container } from '@mui/material';
import axios from 'axios';

const HomePage = ({setPageCount}) => {
    const [cardData, setCardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch card data from the backend
    useEffect(() => {
        setPageCount(0)
        const fetchData = async () => {
            try {
                var api_url = import.meta.env.VITE_BACKEND_API_URL
                const response = await axios.get(`${api_url}/vehicles`); // Replace with your backend API URL
                setCardData(response.data);
            } catch (err) {
                setError('Failed to fetch vehicle data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        // maxWidth="md" -> add these style in Container if you needed minimal screen
        <div className='main-content'>
            <Container sx={{ textAlign: 'center', marginTop: 3 }}>
                <Box>
                    <Typography variant="h3" gutterBottom>
                        Welcome to the Vehicle Rent System
                    </Typography>
                    <Typography variant="h6" paragraph>
                        Book your preferred vehicle from our fleet of cars and bikes. It's fast and easy!
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        href='/book-vehicle'
                        sx={{ padding: '10px 20px', fontSize: '16px' }}
                    >
                        Book a Vehicle
                    </Button>
                </Box>

                <Box sx={{ padding: '20px', marginTop: 5 }}>
                    <Typography variant="h4" gutterBottom>
                        {cardData.length > 0 ? 'Available Vehicles' : 'Vehicles'}
                    </Typography>
                    <Grid container spacing={3}>
                        {
                            cardData.length == 0 && (
                                <Grid item xs={12} sm={12} md={12}>
                                    <Card sx={{ Width: '100%' }}>
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={''}
                                            alt={''}
                                        />
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Please Wait For New Arrival
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                All Vehicles are already rented please wait
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )
                        }
                        {cardData.map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card sx={{ maxWidth: 600 }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={item.image ? item.image : `https://via.placeholder.com/300x200?text=${item.name.split(' ').join('+')}`}
                                        alt={item.name}
                                    />
                                    <CardContent>
                                        <Typography variant="h6">
                                            {item.name}
                                        </Typography>
                                        <Typography variant="body1" gutterBottom>
                                            ({item.type})
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.description}
                                        </Typography>
                                    </CardContent>
                                    <Button size="small" color="primary" sx={{ margin: '10px' }} href='/book-vehicle'>
                                        Book Now
                                    </Button>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </div>
    );
};

export default HomePage;
