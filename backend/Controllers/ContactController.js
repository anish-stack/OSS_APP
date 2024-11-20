const ContactModel = require('../Models/ContactModel');

exports.TakeRequest = async (req, res) => {
    try {
        const { Name, Email, contactNumber, Message, userId } = req.body;

        const newContact = new ContactModel({
            Name,
            Email,
            contactNumber,
            Message,
            userId
        });

        // Save the new contact entry to the database
        await newContact.save();

        // Respond with success message
        res.status(201).json({
            success: true,
            message: "Contact request submitted successfully",
            data: newContact
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error while submitting contact request"
        });
    }
};


exports.GetAll = async (req, res) => {
    try {
        // Get all contact entries from the database
        const contacts = await ContactModel.find()

        // Respond with the list of contacts
        res.status(200).json({
            success: true,
            data: contacts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching contact requests"
        });
    }
};

exports.DeleteRequest = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the contact request by ID
        const contact = await ContactModel.findByIdAndDelete(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact request not found"
            });
        }

        // Respond with success message
        res.status(200).json({
            success: true,
            message: "Contact request deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting contact request"
        });
    }
};
