import sequelize from '../config/db.js';
import Vehicle from '../models/Vehicle.js';
import Booking from '../models/Booking.js';


const create_or_reinitialize = async (req, res) => {
  try {
    await sequelize.sync({ force: true }); // Reset database
    // Seed data
    const vehicles = [
      { type: 'hatchback', name: 'Maruti Swift', description: 'The Maruti Swift is a popular hatchback in India known for its sporty design, fuel efficiency, and reliable performance. Equipped with advanced features and a peppy engine, it offers a comfortable ride for city and highway driving. It is available in both petrol and diesel variants with manual and automatic transmission options.', image: '', num_of_wheel: 4, status: 'unbooked', booking_date_arr: [] },
      { type: 'suv', name: 'Hyundai Creta', description: 'The Hyundai Creta is a best-selling compact SUV in India, celebrated for its stylish design, premium interiors, and advanced features. It offers a choice of petrol and diesel engines, along with manual, automatic, and iMT transmission options. Known for its comfort and performance, it’s a versatile choice for urban and long-distance travel.', image: '', num_of_wheel: 4, status: 'unbooked', booking_date_arr: [] },
      { type: 'sedan', name: 'Honda City', description: 'The Honda City is a premium mid-size sedan known for its elegant design, spacious interiors, and smooth performance. It features advanced safety and tech amenities, including a responsive infotainment system. Available in petrol and hybrid variants, it offers a refined driving experience, making it a favorite among sedan enthusiasts.', image: '', num_of_wheel: 4, status: 'unbooked', booking_date_arr: [] },
      { type: 'cruiser', name: 'Royal Enfield Classic 350', description: 'The Royal Enfield Classic 350 is an iconic cruiser motorcycle known for its retro styling, robust build, and smooth performance. Powered by a refined 350cc engine, it offers a comfortable ride with modern features like a digital-analog instrument cluster and improved ergonomics. It`s a favorite for long-distance touring and city rides alike.', image: '', num_of_wheel: 2, status: 'unbooked', booking_date_arr: [] },
    ];

    await Vehicle.bulkCreate(vehicles);

    console.log('Database seeded successfully.');
    return res.status(200).json({ status: 'SUCCESS', message: `Successfully Created/Updated the DB` })
  } catch (error) {
    console.log('Failed to Create/Update the DB, error code: CRUPDB1001, error: ', error)
    return res.status(200).json({ status: 'SUCCESS', message: `Failed to Create/Update the DB, error code: CRUPDB1001` })
  }
}

export {
  create_or_reinitialize
}
