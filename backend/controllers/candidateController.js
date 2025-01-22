import asyncHandler from '../middlewares/asyncHandler.js';
import Candidate from '../models/candidateModel.js';

// Register a new candidate
export const registerCandidate = asyncHandler(async (req, res) => {
    const { name, party, photoUrl, description } = req.body;

    // Check if candidate already exists
    const existingCandidate = await Candidate.findOne({ name });
    if (existingCandidate) {
        res.status(400);
        throw new Error('Candidate already exists');
    }

    // Create and save the new candidate
    const candidate = new Candidate({
        name,
        party,
        photoUrl: photoUrl || '',  // Set default if no photo URL
        description: description || '',  // Set default if no description
    });

    await candidate.save();

    res.status(201).json({
        message: 'Candidate registered successfully',
        candidate,
    });
});

// Update an existing candidate
export const updateCandidate = asyncHandler(async (req, res) => {
    const { candidateId } = req.params;
    const { name, party, photoUrl, description } = req.body;

    // Find the candidate by ID
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
        res.status(404);
        throw new Error('Candidate not found');
    }

    // Update candidate details
    candidate.name = name || candidate.name;
    candidate.party = party || candidate.party;
    candidate.photoUrl = photoUrl || candidate.photoUrl;
    candidate.description = description || candidate.description;

    await candidate.save();

    res.status(200).json({
        message: 'Candidate updated successfully',
        candidate,
    });
});

// Delete a candidate
export const deleteCandidate = asyncHandler(async (req, res) => {
    const { candidateId } = req.params;

    // Find the candidate by ID and remove it
    const candidate = await Candidate.findByIdAndDelete(candidateId);
    if (!candidate) {
        res.status(404);
        throw new Error('Candidate not found');
    }

    res.status(200).json({
        message: 'Candidate deleted successfully',
    });
});

// Get all candidates
export const getAllCandidates = asyncHandler(async (req, res) => {
   try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
   } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching candidates', error });
   }
});
