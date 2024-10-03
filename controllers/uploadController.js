// controllers/uploadController.js
const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const XLSX = require('xlsx');
const Contact = require('../models/Contact');  // Import the Contact model

// Helper function to process CSV data
const parseCSV = async (filePath) => {
    const contacts = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                contacts.push(row);
            })
            .on('end', () => {
                resolve(contacts);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

// Helper function to process XLSX data
const parseXLSX = async (filePath) => {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];  // Assuming data is in the first sheet
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet);  // Convert sheet to JSON
};

// Controller function for uploading contacts
exports.uploadContacts = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = path.join(__dirname, '..', req.file.path);
    let contacts = [];

    try {
        // Determine file type
        if (req.file.mimetype === 'text/csv') {
            contacts = await parseCSV(filePath);  // Parse CSV data
        } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            contacts = await parseXLSX(filePath);  // Parse XLSX data
        } else {
            return res.status(400).json({ message: 'Invalid file format' });
        }

        // Save contacts to the database
        const savedContacts = await Contact.bulkCreate(contacts, {
            ignoreDuplicates: true,  // Prevent inserting duplicate records
        });

        // Send success response
        res.status(200).json({ message: 'Contacts uploaded successfully', contacts: savedContacts });
    } catch (error) {
        console.error('Error uploading contacts:', error);
        res.status(500).json({ message: 'Failed to upload contacts' });
    } finally {
        // Cleanup the uploaded file
        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting file:', err);
        });
    }
};

// // Controller function to get all contacts
// exports.getAllContacts = async (req, res) => {
//     try {
//         const contacts = await Contact.findAll();
//         res.status(200).json({ contacts });
//     } catch (error) {
//         console.error('Error fetching contacts:', error);
//         res.status(500).json({ message: 'Failed to fetch contacts' });
//     }
// };

// exports.getAllContacts = async (req, res) => {
//     const { page = 1, limit = 10, state, companyName } = req.query;

//     const filter = {};
//     if (state) filter.state = state;  // Add state filter if provided
//     if (companyName) filter.companyName = companyName;  // Add companyName filter if provided

//     try {
//         const offset = (page - 1) * limit;
//         const contacts = await Contact.findAndCountAll({
//             where: filter,
//             limit: parseInt(limit),
//             offset: parseInt(offset),
//         });

//         res.status(200).json({
//             total: contacts.count,
//             contacts: contacts.rows,
//             totalPages: Math.ceil(contacts.count / limit),
//             currentPage: parseInt(page),
//         });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch contacts' });
//     }
// };