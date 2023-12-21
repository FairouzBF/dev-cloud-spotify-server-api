const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/errorHandler');
const apiRouter = require('./routes');
const app = express();
require('dotenv').config();

// Log environment variables
console.log('MONGODB_USER:', process.env.MONGODB_USER);
console.log('MONGODB_PASSWORD:', process.env.MONGODB_PASSWORD);
console.log('MONGODB_CLUSTER:', process.env.MONGODB_CLUSTER);
console.log('PORT:', process.env.PORT);

const corsOptions = {
  origin: 'http://localhost:3000', // Change this to your frontend domain
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set('strictQuery', false);
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}${process.env.MONGODB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 50000,
      connectTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000,  // 45 seconds
    }
  )
  .then(() => {
    console.log(`Successfully connect to database`);
  })
  .catch(err => console.log(err));

app.use('/covers', express.static('covers'));
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Hello, this is the homepage!');
});

app.use("/api/v1", apiRouter);
app.use(errorHandler);

app.listen(process.env.PORT, function () {
  console.log('server launch my Spotify APP on port', process.env.PORT);
});
