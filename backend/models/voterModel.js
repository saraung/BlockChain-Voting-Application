import mongoose from 'mongoose';

const voterSchema = new mongoose.Schema({
    voterId: { type: String, required: true, unique: true }, // Unique Voter ID
    name: { type: String, required: true },
    biometricId: { type: String, required: true }, // Biometric ID used for authentication
    pollingStationId: { type: String, required: true },  // Associate voter with polling station
});

const Voter = mongoose.model("Voter", voterSchema);

export default Voter;

