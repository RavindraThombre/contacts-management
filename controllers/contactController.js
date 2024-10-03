// controllers/contactController.js
const Contact = require('../models/Contact');

exports.createContact = async (req, res) => {
    try {
        const contact = await Contact.create(req.body);
        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Error creating contact', error });
    }
};

exports.getContacts = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const contacts = await Contact.findAll({
            offset: (page - 1) * limit,
            limit: parseInt(limit),
        });
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts', error });
    }
};

exports.deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        await Contact.destroy({ where: { id } });
        res.status(200).json({ message: 'Contact deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact', error });
    }
};


