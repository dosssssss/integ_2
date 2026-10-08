require('dotenv').config({ quiet: true });

const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const customerRoutes = require('./routes/customerRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/customers', customerRoutes);
app.use('/api/foods', foodRoutes);
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use('/api/orders', orderRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

function startServer() {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (process.env.MONGO_URI) {
  connectDB().then(startServer);
} else {
  console.warn('MONGO_URI is not set. MongoDB-backed food routes are unavailable.');
  startServer();
}
