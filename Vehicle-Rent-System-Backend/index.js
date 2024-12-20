import express from 'express';
var app = express();
import sls from 'serverless-http';
import cors from 'cors';

import bodyParser from 'body-parser'
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
import Routes from "./src/routes/route.js"

// Enable CORS
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ['http://localhost:5173', 'https://your-frontend.com'];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);
// Routes mapped
app.use('/', Routes)

//Serverless deployment
export const server = sls(app)

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});