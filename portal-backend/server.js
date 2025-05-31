require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const connectDB = require('./config/db');
connectDB();


const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use('/api', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));