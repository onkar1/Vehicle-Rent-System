import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Booking = sequelize.define('Booking', {
  vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  customer_first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customer_last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  booking_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export default Booking;
