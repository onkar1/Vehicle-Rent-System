// import Vehicle from '../models/Vehicle.js';
// import Booking from '../models/Booking.js';
import sequelize from '../config/db.js';

/**
 * Fetch all vehicles from the database.
 */
const getAllVehicles = async (req, res) => {
  try {
    // const vehicles = await Vehicle.findAll();
    const [vehicles, metadata] = await sequelize.query('SELECT * FROM Vehicles');
    return res.status(200).json(vehicles);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching vehicles: ' + error.message });
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
  const formatted_date_f = new Date(formattedDateStr);
  return formatted_date_f
}

const bookVehicle = async (req, res) => {
  const { fname, lname, wheel_no, vehicle_type, vehicle_model, start_date, end_date, booking_date } = req.body;

  try {
    // Check for overlapping bookings
    // const overlappingBooking = await Booking.findOne({
    //   where: {
    //     vehicleId,
    //     [sequelize.Op.or]: [
    //       {
    //         startDate: { [sequelize.Op.between]: [startDate, endDate] },
    //       },
    //       {
    //         endDate: { [sequelize.Op.between]: [startDate, endDate] },
    //       },
    //     ],
    //   },
    // });
    const formattedstart_date_f = await getFormatedDate(start_date);
    const formattedend_date_f = await getFormatedDate(end_date);
    const formattedbooking_date_f = await getFormatedDate(booking_date);

    console.log("fname, lname, wheel_no, vehicle_type, vehicle_model, start_date, end_date, booking_date: ", fname, lname, wheel_no, vehicle_type, vehicle_model, start_date, end_date, booking_date, 'formattedstart_date_f: ', formattedstart_date_f)

    const [vehicles, metadata_vehicles] = await sequelize.query(
      'SELECT id, status FROM Vehicles WHERE type = ? AND name = ? AND num_of_wheel=? AND booking_end_date < ? limit 1',
      {
        replacements: [vehicle_type, vehicle_model, wheel_no, formattedstart_date_f],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // console.log("vehicles: ", vehicles)
    if (vehicles) {
      if (Object.keys(vehicles).length > 0) {
        var vehicle_id = vehicles['id']
        await sequelize.query(
          'INSERT INTO Bookings (vehicle_id, customer_first_name, customer_last_name, booking_date, start_date, end_date, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          {
            replacements: [vehicle_id, fname, lname, formattedbooking_date_f, formattedstart_date_f, formattedend_date_f, formattedbooking_date_f, formattedbooking_date_f],
            type: sequelize.QueryTypes.INSERT,
          }
        );

        await sequelize.query(
          'UPDATE Vehicles SET status = ?, booking_end_date = ?, updatedAt = ? WHERE id = ?',
          {
            replacements: [
              'Booked',
              formattedend_date_f,
              formattedbooking_date_f,
              vehicle_id,
            ],
            type: sequelize.QueryTypes.UPDATE,
          }
        );
        return res.status(200).json({ status: 'SUCCESS', message: `Successfully booked ${vehicle_model}(${vehicle_type} - ${wheel_no} Wheeler)` })
      }
    } else {
      const [vehicleWithMaxDate, metadataMax] = await sequelize.query(
        'SELECT booking_end_date FROM Vehicles WHERE type = ? AND name = ? AND num_of_wheel = ? ORDER BY booking_end_date DESC LIMIT 1',
        {
          replacements: [vehicle_type, vehicle_model, wheel_no],
          type: sequelize.QueryTypes.SELECT,
        }
      )

      console.log("vehicleWithMaxDate: ", vehicleWithMaxDate)
      if (vehicleWithMaxDate) {
        if (Object.keys(vehicleWithMaxDate).length > 0) {
          var vehicle_booking_min_date = vehicleWithMaxDate['booking_end_date']
          return res.status(200).json({ status: ' FAILED', message: `Vehicle is already booked until ${vehicle_booking_min_date.split(' ')[0]}. Please choose a later date or select a different vehicle.` });
        }
      }

    }
    return res.status(200).json({ status: ' FAILED', message: `Vehicle is already booked for the selected dates (${start_date.split(',')[0]} to ${end_date.split(',')[0]}). Please choose a different date or select another vehicle.` });


  } catch (error) {
    console.log("error: ", error)
    return res.status(200).json({ status: 'FAILED', message: 'Failed to book vehicle, Error code: VBVC124512 ' });
  }
};


export {
  getAllVehicles,
  bookVehicle
};