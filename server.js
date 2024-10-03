// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/config');
const User = require('./models/User');
const Contact = require('./models/Contact');

const app = express();

//middleware
app.use(cors());
app.use(express.json()); // for parsing application/json
const PORT = process.env.PORT || 5000;

// Import routes
const userRoutes = require('./routes/user');
const contactRoutes = require('./routes/contact');
const uploadRoutes = require('./routes/uploadRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');


// Use routes
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', uploadRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


sequelize.sync().then(() => {
    console.log('Database synced');
});