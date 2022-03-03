const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./src/routes/auth.routes');
const sauceRoutes = require('./src/routes/sauce.routes');
const path = require('path');
const app = express();

require('dotenv').config()



//* Connect to DB
mongoose.connect(process.env.DB_URL)
  .then(() => console.log('Connected to DB !'))
  .catch(() => console.log('Failed to connect to DB !'));



app.use(express.json());
app.use(cors());

//* Security
app.use(helmet());


//* Path
app.use('/images', express.static(path.join(__dirname, '/public/images')));


//* Routes 
app.use('/api/auth', authRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;