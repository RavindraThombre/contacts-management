const Contact = require("../models/Contact");

// Controller function to get all contacts
exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.findAll();
        res.status(200).json({ contacts });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Failed to fetch contacts' });
    }
};