const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./UserRoutes');
const visitRoutes = require('./VisitRoutes');
const adminRoutes = require('./AdminRoutes');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

const uri = process.env.MONGODB_URI;

app.use(cors({
  origin: 'https://medouss.vercel.app/', // specify your frontend domain
}));
app.use(helmet());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api', visitRoutes);
app.use('/', adminRoutes);

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Express server listening on port ${PORT}`);
});
