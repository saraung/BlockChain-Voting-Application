import mongoose from 'mongoose';

// Define the schema for a candidate
const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,  // Candidate name is required
        unique: true     // Ensure each candidate's name is unique
    },
    party: {
        type: String,
        required: true,  // Party name is required
    },
    // Optionally, you could add other fields like photo URL, description, etc.
    photoUrl: {
        type: String,
        default: '',  // Default empty if no photo URL is provided
    },
    description: {
        type: String,
        default: '',  // Default empty description
    }
});

// Create a model based on the schema
const Candidate = mongoose.model('Candidate', candidateSchema);

export default  Candidate;
