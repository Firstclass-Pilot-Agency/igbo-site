import express from 'express';
import mongoose, { connect } from 'mongoose';
import cors from 'cors'
import { connectToMongoDB } from './db/dbConfig.js';

import adminRoute from './db/routes/adminRoute.js';
import userRoute from './db/routes/userRoute.js'
import lessonRoute from './db/routes/lessonRoute.js'
import testRoute from './db/routes/testRoute.js';



connectToMongoDB();

const app = express();
const PORT = process.env.PORT || 3000;


// middleware
const allowedOrigins = ['http://localhost:5173', 'https://igbo-learning.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    // Check if the origin is in the list of allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.urlencoded({extended:false}))
app.use(express.json());


// routes
app.get('/', (req, res) => {
  res.send('Server is up and running')
})

// main Routes
app.use('/api/admin', adminRoute);
app.use('/api/user', userRoute);
app.use('/api/lesson', lessonRoute)
app.use('/api/test', testRoute)



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});