const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Import route modules
const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

// Use routes properly - make sure these modules export routers!
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
