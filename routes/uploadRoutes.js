// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');


// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // Directory for storing uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);  // Use timestamp for unique filenames
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const fileTypes = /csv|xlsx/;
        const extName = fileTypes.test(file.originalname.split('.').pop().toLowerCase());
        if (extName) {
            cb(null, true);
        } else {
            cb(new Error('Only .csv or .xlsx files are allowed!'));
        }
    }
});

// Route to handle file uploads
router.post('/upload', upload.single('file'), uploadController.uploadContacts);

// Route to get all contacts
// router.get('/contacts', uploadController.getAllContacts);


module.exports = router;


