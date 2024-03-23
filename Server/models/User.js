const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,   // Email is required
        unique: true,    // Email must be unique
        lowercase: true  // Convert email to lowercase
    },
    password: {
        type: String,
        required: true    // Password is required
    }
}, {
    timestamps: true     // Automatically add createdAt and updatedAt fields
});

// Create and export the User model
module.exports = mongoose.model('User', userSchema);
