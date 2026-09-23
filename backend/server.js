require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', taskRoutes);
app.use('/api', analyticsRoutes);

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err.message);
    process.exit(1);
  }
}

start();