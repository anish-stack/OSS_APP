const Policy = require('../Models/Policy.model');

// Create a new Policy
exports.createPolicy = async (req, res) => {
    try {
        const { typeOfPolicy, Heading, WrittienBy, HtmlContent } = req.body;
        
        const newPolicy = new Policy({
            typeOfPolicy,
            Heading,
            WrittienBy,
            HtmlContent
        });

        await newPolicy.save();

        res.status(201).json({
            success: true,
            message: 'Policy created successfully',
            data: newPolicy
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error creating policy',
            error: error.message
        });
    }
};

// Get all Policies
exports.getAllPolicies = async (req, res) => {
    try {
        const policies = await Policy.find();

        res.status(200).json({
            success: true,
            data: policies
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching policies',
            error: error.message
        });
    }
};

// Get a single Policy by ID
exports.getSinglePolicy = async (req, res) => {
    const { id } = req.params;

    try {
        const policy = await Policy.findById(id);

        if (!policy) {
            return res.status(404).json({
                success: false,
                message: 'Policy not found'
            });
        }

        res.status(200).json({
            success: true,
            data: policy
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching policy',
            error: error.message
        });
    }
};

// Update a Policy by ID
exports.updatePolicy = async (req, res) => {
    const { id } = req.params;
    const { typeOfPolicy, Heading, WrittienBy, HtmlContent } = req.body;

    try {
        const updatedPolicy = await Policy.findByIdAndUpdate(
            id,
            { typeOfPolicy, Heading, WrittienBy, HtmlContent },
            { new: true }
        );

        if (!updatedPolicy) {
            return res.status(404).json({
                success: false,
                message: 'Policy not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Policy updated successfully',
            data: updatedPolicy
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error updating policy',
            error: error.message
        });
    }
};

// Delete a Policy by ID
exports.deletePolicy = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPolicy = await Policy.findByIdAndDelete(id);

        if (!deletedPolicy) {
            return res.status(404).json({
                success: false,
                message: 'Policy not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Policy deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error deleting policy',
            error: error.message
        });
    }
};
