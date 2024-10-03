const express = require('express');
const { getAllContacts } = require('../controllers/dashboardController');
const router = express.Router();

router.get('/contacts', getAllContacts);


module.exports = router;
