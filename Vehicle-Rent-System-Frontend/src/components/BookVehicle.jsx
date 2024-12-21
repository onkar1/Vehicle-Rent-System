import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, CardContent, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Grid, CircularProgress, Box, Slider, Container, Typography, Checkbox } from '@mui/material';
import { DateRangePicker, createStaticRanges } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Styles for date picker
import 'react-date-range/dist/theme/default.css'; // Theme for date picker
import MessageModal from './MessageModal'; // Import the MessageModal component
import { useMediaQuery } from '@mui/material'; // Import MUI's useMediaQuery hook

const BookVehicle = ({ setPageCount }) => {
    // Define isMobile using useMediaQuery to check screen size
    const isMobile = useMediaQuery('(max-width:600px)');

    const [vehicleData, setVehicleData] = useState([]);
    const [step, setStep] = useState(0); // Track the current step
    const [name, setName] = useState({ firstName: '', lastName: '' });
    const [vehicleType, setVehicleType] = useState('');
    const [vehicleModel, setVehicleModel] = useState('');
    // Create a new date object for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Set to tomorrow's date
    const [dateRange, setDateRange] = useState([{
        startDate: tomorrow,
        endDate: tomorrow,
        key: 'selection'
    }]);

    const [minDataValid, setMinDataValid] = useState(new Date());


    const [vehicleWheelNumberArr, setVehicleWheelNumberArr] = useState([]);
    const [vehicleTypeObjArr, setVehicleTypeObjArr] = useState({});
    const [vehicleModelArr, setVehicleModelArr] = useState([]);


    const [vehicleWheelNumber, setVehicleWheelNumber] = useState(0);

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');


    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({}); // Error state for each field
    const [error, setError] = useState(''); // General error message
    const firstNameRef = useRef(null); // Ref for focusing on the first name field
    const lastNameRef = useRef(null); // Ref for focusing on the last name field

    // State for checkbox and confirmation message
    const [isChecked, setIsChecked] = useState(false);
    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };
    // Format date to display it as a string
    const formatDate = (date) => {
        return date.toLocaleDateString(); // You can customize the format as needed
    };

    useEffect(() => {
        setPageCount(1)
        // Fetch vehicle types from the backend
        var api_url = import.meta.env.VITE_BACKEND_API_URL
        axios.get(`${api_url}/vehicles`)
            .then(response => {
                if (response.data.status === 'SUCCESS') {
                    var vehicles_data = response.data.data
                    setVehicleData(vehicles_data);
                    var wheel_no = []
                    var vehicle_type_obj = {}
                    for (const element of vehicles_data) {
                        if (element['num_of_wheel']) {
                            if (!wheel_no.includes(element['num_of_wheel'])) {
                                wheel_no.push(element['num_of_wheel'])
                                vehicle_type_obj[element['num_of_wheel']] = []
                                vehicle_type_obj[element['num_of_wheel']].push(element['type'])
                            } else {
                                if (!Object.keys(vehicle_type_obj).includes(element['type'])) {
                                    vehicle_type_obj[element['num_of_wheel']].push(element['type'])
                                }
                            }
                        }
                    }
                    setVehicleWheelNumberArr(wheel_no)
                    setVehicleTypeObjArr(vehicle_type_obj)
                } else {
                    setLoading(false);
                    setMessage(response.data.message)
                    setOpen(true);
                    setTimeout(() => {
                        window.location.href = '/'
                    }, 3000);
                }
            })
            .catch(err => {
                setError('Error fetching vehicle types');
            });
    }, []);

    useEffect(() => {
    }, [vehicleModelArr]);


    const handleNext = () => {
        let validationErrors = {};

        if (step === 0) {
            // Step 1 validation: Ensure both first name and last name are filled
            if (!name.lastName) {
                validationErrors.lastName = 'Please enter your last name';
                lastNameRef.current.focus(); // Focus on the last name field
            }
            if (!name.firstName) {
                validationErrors.firstName = 'Please enter your first name';
                firstNameRef.current.focus(); // Focus on the first name field
            }
        }

        if (step === 1) {
            // Step 2 validation: Ensure a vehicle type is selected
            if (!vehicleWheelNumber) {
                validationErrors.vehicleWheelNumber = 'Please select the number of wheels';
            }
        }

        if (step === 2) {
            // Step 3 validation: Ensure a vehicle type is selected from the list
            if (!vehicleType) {
                validationErrors.vehicleType = 'Please select a vehicle type';
            }
            if (vehicleData) {
                var vehicle_model_arr = []
                if (vehicleData.length > 0) {
                    for (const element of vehicleData) {
                        if (element['num_of_wheel'] === vehicleWheelNumber) {
                            if (element['type'] === vehicleType) {
                                vehicle_model_arr.push(element['name'])
                            }
                        }
                    }
                }
                setVehicleModelArr(vehicle_model_arr)
            }
        }
        if (step === 3) {
            // Step 4 validation: Ensure a vehicle model is selected
            if (!vehicleModel) {
                validationErrors.vehicleModel = 'Please select a vehicle model';
                // vehicleModelRef.current.focus(); // Focus on the vehicle model field
            }

        }

        if (step === 4) {
            // Step 5 validation: Ensure a valid date range is selected
            if (!dateRange[0].startDate || !dateRange[0].endDate || dateRange[0].startDate >= dateRange[0].endDate) {
                validationErrors.dateRange = 'Please select a valid date range';
                // dateRangeRef.current.focus(); // Focus on the date range picker
            }
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors); // Set the error state
            return; // Stop execution if there are errors
        }

        // If all validations pass, move to the next step
        setErrors({});
        setError('');
        if (step < 4) {
            setStep(step + 1);
        }
    };

    const handlePrev = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (dateRange) {
            if (dateRange[0]['startDate']) {
                setLoading(true);
                const bookingData = {
                    fname: name.firstName,
                    lname: name.lastName,
                    wheel_no: vehicleWheelNumber,
                    vehicle_type: vehicleType,
                    vehicle_model: vehicleModel,
                    start_date: (dateRange[0].startDate).toLocaleString(),
                    end_date: (dateRange[0].endDate).toLocaleString(),
                    booking_date: new Date().toLocaleString()
                };

                // Send booking data to the backend
                var api_url = import.meta.env.VITE_BACKEND_API_URL
                axios.post(`${api_url}/book`, bookingData)
                    .then(response => {
                        setLoading(false);
                        setMessage(response.data.message)
                        setOpen(true);
                        if (response.data.status === 'SUCCESS') {
                            setTimeout(() => {
                                window.location.href = '/'
                            }, 3000);
                        }
                    })
                    .catch(err => {
                        setLoading(false);
                        setMessage('Error booking vehicle, Error Code: VFBV234001')
                        setOpen(true);
                    });
            }
        }

    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <MessageModal open={open} message={message} onClose={handleClose} />
            <Container sx={{ textAlign: 'center', marginTop: 15, marginBottom: 15 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }} gutterBottom>
                        Book a Vehicle
                    </Typography>
                    <Typography variant="h7" paragraph>
                        Book your preferred vehicle from our fleet of cars and bikes. It's fast and easy!
                    </Typography>
                </Box>
                {/* {error && <div className="text-red-500 mb-4">{error}</div>} */}

                <Card>
                    <CardContent>
                        {/* Step Indicator */}
                        <Box mb={2} sx={{ marginTop: 2 }}>
                            <Slider
                                value={step}
                                max={4}
                                step={1}
                                valueLabelDisplay="auto"
                                valueLabelFormat={(value) => `${value * 25}%`}
                            />
                        </Box>

                        {/* Step 1: Name Input */}
                        {step === 0 && (
                            <div>
                                <h3>What is your name?</h3>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="First Name"
                                            variant="outlined"
                                            fullWidth
                                            value={name.firstName}
                                            onChange={(e) => setName({ ...name, firstName: e.target.value })}
                                            required
                                            inputRef={firstNameRef}
                                            error={name.firstName ? false : !!errors.firstName}
                                            helperText={name.firstName ? '' : errors.firstName}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Last Name"
                                            variant="outlined"
                                            fullWidth
                                            value={name.lastName}
                                            onChange={(e) => setName({ ...name, lastName: e.target.value })}
                                            required
                                            inputRef={lastNameRef}
                                            error={name.lastName ? false : !!errors.lastName}
                                            helperText={name.lastName ? '' : errors.lastName}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        )}

                        {/* Step 2: Number of Wheels */}
                        {step === 1 && (
                            <div>
                                <h3>Number of wheels<span style={{ color: 'red' }}>*</span></h3>
                                <FormControl component="fieldset">
                                    {/* <FormLabel component="legend">Select the number of wheels</FormLabel> */}
                                    <RadioGroup
                                        value={vehicleWheelNumber}
                                        onChange={(e) => setVehicleWheelNumber(parseInt(e.target.value))}
                                        required
                                    >
                                        {vehicleWheelNumberArr.map((wheel_num, index_key) => (
                                            <FormControlLabel key={index_key} value={wheel_num} control={<Radio />} label={`${wheel_num}-Wheeler`} />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                {vehicleWheelNumber ? '' : (errors.vehicleWheelNumber && <div style={{ color: 'red', marginTop: '5px' }}>{errors.vehicleWheelNumber}</div>)}
                            </div>
                        )}

                        {/* Step 3: Vehicle Type */}
                        {step === 2 && (
                            <div>
                                <h3>Type of Vehicle<span style={{ color: 'red' }}>*</span></h3>
                                <FormControl component="fieldset">
                                    {/* <FormLabel component="legend">Select Vehicle Type</FormLabel> */}
                                    <RadioGroup
                                        value={vehicleType}
                                        onChange={(e) => setVehicleType(e.target.value)}
                                        required
                                    >
                                        {vehicleTypeObjArr[vehicleWheelNumber].map((type, index_key) => (
                                            <FormControlLabel key={index_key} value={type} control={<Radio />} label={type} />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                {vehicleType ? '' : (errors.vehicleType && <div style={{ color: 'red', marginTop: '5px' }}>{errors.vehicleType}</div>)}
                            </div>
                        )}

                        {/* Step 4: Vehicle Model */}
                        {step === 3 && (
                            <div>
                                <h3>Specific Model<span style={{ color: 'red' }}>*</span></h3>
                                <FormControl component="fieldset">
                                    {/* <FormLabel component="legend">Select Vehicle Model</FormLabel> */}
                                    <RadioGroup
                                        value={vehicleModel}
                                        onChange={(e) => setVehicleModel(e.target.value)}
                                        required
                                    >
                                        {vehicleModelArr.map((model, index_key) => (
                                            <FormControlLabel key={index_key} value={model} control={<Radio />} label={model} />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                {vehicleModel ? '' : (errors.vehicleModel && <div style={{ color: 'red', marginTop: '5px' }}>{errors.vehicleModel}</div>)}
                            </div>
                        )}

                        {/* Step 5: Date Range Picker */}
                        {step === 4 && (
                            <>
                                <h3>Select Booking Dates</h3>
                                {
                                    isMobile ? (
                                        <Box sx={{ height: 400, paddingLeft: '-100px' }}>
                                            <DateRangePicker
                                                ranges={dateRange}
                                                onChange={(item) => setDateRange([item.selection])}
                                                // showSelectionPreview={true}
                                                // moveRangeOnFirstSelection={false}
                                                months={1}
                                                direction="horizontal"
                                                minDate={minDataValid} // Disable previous days
                                            />
                                        </Box>
                                    ) : (
                                        <Box sx={{ height: 400 }}>
                                            <DateRangePicker
                                                ranges={dateRange}
                                                onChange={(item) => setDateRange([item.selection])}
                                                showSelectionPreview={true}
                                                moveRangeOnFirstSelection={false}
                                                months={2}
                                                direction="horizontal"
                                                minDate={minDataValid} // Disable previous days
                                                rangeColors={['#3f51b5']} // Customize range color
                                                showMonthAndYearPickers={false} // Optional, hides month/year pickers
                                                staticRanges={createStaticRanges([
                                                    {
                                                        label: 'Next Day',
                                                        range: () => {
                                                            const tomorrow = new Date();
                                                            tomorrow.setDate(tomorrow.getDate() + 1);
                                                            return {
                                                                startDate: tomorrow,
                                                                endDate: tomorrow,
                                                            };
                                                        },
                                                        isSelected: (range) => {
                                                            const tomorrow = new Date();
                                                            tomorrow.setDate(tomorrow.getDate() + 1);
                                                            return (
                                                                range.startDate.toDateString() === tomorrow.toDateString() &&
                                                                range.endDate.toDateString() === tomorrow.toDateString()
                                                            );
                                                        },
                                                    },
                                                    {
                                                        label: 'Next 7 Days',
                                                        range: () => {
                                                            const start = new Date();
                                                            const end = new Date();
                                                            end.setDate(start.getDate() + 7);
                                                            return { startDate: start, endDate: end };
                                                        },
                                                        isSelected: (range) =>
                                                            range.startDate.toDateString() === new Date().toDateString() &&
                                                            range.endDate.toDateString() ===
                                                            new Date(new Date().setDate(new Date().getDate() + 7)).toDateString(),
                                                    },
                                                    {
                                                        label: 'Next 30 Days',
                                                        range: () => {
                                                            const start = new Date();
                                                            const end = new Date();
                                                            end.setDate(start.getDate() + 30);
                                                            return { startDate: start, endDate: end };
                                                        },
                                                        isSelected: (range) =>
                                                            range.startDate.toDateString() === new Date().toDateString() &&
                                                            range.endDate.toDateString() ===
                                                            new Date(new Date().setDate(new Date().getDate() + 30)).toDateString(),
                                                    },
                                                ])}
                                                inputRanges={[]} // Remove the input range for "Yesterday"
                                            />
                                        </Box>
                                    )
                                }
                                {errors.dateRange && <div style={{ color: 'red', marginTop: '5px' }}>{errors.dateRange}</div>}
                            </>
                        )}

                        {step === 4 && (
                            <Box mt={4} display="block" justifyContent="space-between">

                                <>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={isChecked}
                                                onChange={handleCheckboxChange}
                                                color="primary"
                                            />
                                        }
                                        // label={`I confirm the above filled data is correct and I want rent ${vehicleModel}(${vehicleType}-${vehicleWheelNumber}-Wheeler) from ${dateRange[0]['startDate']} to ${dateRange[0]['endDate']}`}
                                        label={`I confirm the above filled data is correct and I want to rent ${vehicleModel} (${vehicleType}-${vehicleWheelNumber}-Wheeler) from ${formatDate(dateRange[0].startDate)} to ${formatDate(dateRange[0].endDate)}`}

                                    />
                                </>
                                <div>note*: Our team will contact you for further confirmation and location details</div>
                            </Box>
                        )
                        }

                        {/* Navigation Buttons */}
                        <Box mt={4} display="flex" justifyContent="space-between">
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handlePrev}
                                disabled={step === 0}
                            >
                                Previous
                            </Button>
                            {step === 4 ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                    disabled={isChecked ? loading : true}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Submit'}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                >
                                    Next
                                </Button>
                            )}
                        </Box>
                    </CardContent>
                </Card >
            </Container >

        </>
    );
};

export default BookVehicle;
