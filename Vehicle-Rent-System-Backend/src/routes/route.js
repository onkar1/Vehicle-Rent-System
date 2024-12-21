import express from "express";
const router = express.Router();
import bodyParser from 'body-parser';
bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();
import { getAllVehicles, bookVehicle } from '../controllers/vehicleController.js';
import { create_or_reinitialize } from "../migrations/seed.js";


// Dummy route, invoke for keeping warm instance of lambda
router.get('/dummyapi', (req, res) => { 
  console.log("Invoked DUMMY API")
  res.send("DUMMY API Invoked");
});


// Get all vehicles
// router.get('/vehicles', async (req, res) => {
//   try {
//     const vehicles = await getAllVehicles();
//     res.json(vehicles);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Submit booking
// router.post('/book', async (req, res) => {
//   const { customerName, vehicleId, startDate, endDate } = req.body;

//   try {
//     const booking = await bookVehicle({ customerName, vehicleId, startDate, endDate });
//     res.status(201).json(booking);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

router.get('/vehicles', jsonParser, getAllVehicles);
router.post('/book', jsonParser, bookVehicle);
router.get('/resetdb', jsonParser, create_or_reinitialize);


export default router;

