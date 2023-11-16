const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/errorHandler');
const apiRouter = require('./routes');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

mongoose.set('strictQuery', false);
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}${process.env.MONGODB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`,
  )
  .then(() => {
    console.log(`Successfully connect to database`);
  })
  .catch(err => console.log(err));


app.use("/api/v1", apiRouter);
app.use(errorHandler);

app.listen(process.env.PORT, function () {
  console.log('server launch my');
});