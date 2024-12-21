import sequelize from '../config/db.js';


const getAllVehicles = async (req, res) => {
  try {
    // const vehicles = await Vehicle.findAll();
    const [vehicles, metadata] = await sequelize.query('SELECT * FROM Vehicles where status="booked" or status="unbooked"');
    return res.status(200).json({status: 'SUCCESS', data: vehicles});
  } catch (error) {
    console.log('Failed to get data, Error Code: GAVSR41051, error: ', error)
    return res.status(200).json({ status: 'FAILED', message: 'Failed to retrive data please try after some time, Error Code: GAVSR41051'});
  }
};


// Book a vehicle if no overlapping booking exists.
const getFormatedDate = async (data_str) => {
  // Split the date and time parts
  const [datePart, timePart] = data_str.split(', ');
  // Split the date part into day, month, and year
  const [day, month, year] = datePart.split('/');
  // Create a new Date object with the format YYYY-MM-DDTHH:mm:ss
  const formattedDateStr = `${year}-${month}-${day}T${timePart}`;
  const formatted_date_f = new Date(formattedDateStr + 'Z');
  return formatted_date_f
}

const generateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateRange = [];

  while (start <= end) {
    // Push the date in YYYY-MM-DD format
    dateRange.push(start.toISOString().split('T')[0]);
    start.setDate(start.getDate() + 1); // Increment the date by 1
  }

  return dateRange;
};

const checkBookingStatus = (user_date_arr, booked_date_arr) => {
  // Convert booked_date_arr to a Set for faster lookup
  const bookedDatesSet = new Set(booked_date_arr);

  // Separate user dates into available and unavailable
  const availableDates = [];
  const unavailableDates = [];

  user_date_arr.forEach(date => {
    if (bookedDatesSet.has(date)) {
      unavailableDates.push(date);
    } else {
      availableDates.push(date);
    }
  });

  // Determine the overall booking status
  const status = unavailableDates.length > 0 ? 'booked' : 'unbooked';

  // If unbooked, combine both arrays into a full range
  let combinedDates = [];
  if (status === 'unbooked') {
    const allDates = [...user_date_arr, ...booked_date_arr];
    const sortedDates = allDates.sort((a, b) => new Date(a) - new Date(b));
    combinedDates = sortedDates;
  }

  return {
    status,
    availableDates,
    unavailableDates,
    combinedDates: status === 'unbooked' ? combinedDates : null,
  };
};

const bookVehicle = async (req, res) => {
  const { fname, lname, wheel_no, vehicle_type, vehicle_model, start_date, end_date, booking_date } = req.body;
  try {
    const formattedstart_date_f = await getFormatedDate(start_date);
    const formattedend_date_f = await getFormatedDate(end_date);
    const formattedbooking_date_f = await getFormatedDate(booking_date);

    const [vehicles, metadata_vehicles] = await sequelize.query(
      'SELECT id, status, booking_date_arr FROM Vehicles WHERE type = ? AND name = ? AND num_of_wheel=? limit 1',
      {
        replacements: [vehicle_type, vehicle_model, wheel_no],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (vehicles) {
      if (Object.keys(vehicles).length > 0) {
        var vehicle_id = vehicles['id']
        var booking_date_arr = JSON.parse(vehicles['booking_date_arr'])
        var booking_date_arr_user = generateDateRange(formattedstart_date_f, formattedend_date_f)

        var result_of_booking = checkBookingStatus(booking_date_arr_user, booking_date_arr)
        if (result_of_booking.status === 'unbooked') {
          await sequelize.query(
            'INSERT INTO Bookings (vehicle_id, customer_first_name, customer_last_name, booking_date, start_date, end_date, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            {
              replacements: [vehicle_id, fname, lname, formattedbooking_date_f, formattedstart_date_f, formattedend_date_f, formattedbooking_date_f, formattedbooking_date_f],
              type: sequelize.QueryTypes.INSERT,
            }
          );

          await sequelize.query(
            'UPDATE Vehicles SET status = ?, booking_date_arr = ?, updatedAt = ? WHERE id = ?',
            {
              replacements: [
                'booked',
                JSON.stringify(result_of_booking.combinedDates),
                formattedbooking_date_f,
                vehicle_id,
              ],
              type: sequelize.QueryTypes.UPDATE,
            }
          );
          return res.status(200).json({ status: 'SUCCESS', message: `Successfully booked ${vehicle_model}(${vehicle_type} - ${wheel_no} Wheeler)` })
        }
        return res.status(200).json({ status: ' FAILED', message: `Vehicle is already booked for the selected dates (${result_of_booking.unavailableDates.join(', ')}). Please choose a different date or select another vehicle.` });
      }
    }
    return res.status(200).json({ status: ' FAILED', message: `Vehicle is already booked for the selected dates (${start_date.split(',')[0]} to ${end_date.split(',')[0]}). Please choose a different date or select another vehicle.` });


  } catch (error) {
    console.log("Failed to book vehicle, Error code: VBVC124512, error: ", error)
    return res.status(200).json({ status: 'FAILED', message: 'Failed to book vehicle, Error code: VBVC124512 ' });
  }
};


export {
  getAllVehicles,
  bookVehicle
};