import asyncHandler from "../middlewares/asyncHandler.js";
import Voter from "../models/voterModel.js";

// Register a new voter (admin action)
export const registerVoter = async (req, res) => {
    try {
        const { voterId, name, biometricId, pollingStationId } = req.body;  // Use voterId for identification

        // Check if the voter already exists
        const existingVoter = await Voter.findOne({ voterId });
        if (existingVoter) {
            return res.status(400).json({ message: "Voter already registered" });
        }

        // Create a new voter with the biometricId and voterId
        const voter = new Voter({ voterId, name, biometricId, pollingStationId });
        await voter.save();

        res.status(201).json({ message: "Voter registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering voter", error });
    }
};

// Get all voters for a specific polling station (admin action)
export const getVotersByPollingStation = async (req, res) => {
    try {
        const { pollingStationId } = req.params;

        // Fetch voters for the specified polling station
        const voters = await Voter.find({
            pollingStationId: { $regex: new RegExp(`^${pollingStationId}$`, "i") }
          });
        if (!voters.length) {
            return res.status(404).json({ message: "No voters found for this polling station" });
        }

        res.json(voters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching voters", error });
    }
};


export const updateVoterById=async(req,res)=>{
    try{
        const {id}=req.params;
        const updatedVoter=await Voter.findByIdAndUpdate(id,req.body,{new:true});
        if(!updatedVoter){
            return res.status(404).json({message:"Voter not found"});
        }
        res.json(updatedVoter);
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Error updating voter",error});
    }
}

export const deleteVoterById = async(req, res)=>{
    try{
        const {id}=req.params;
        const deletedVoter=await Voter.findByIdAndDelete(id);
        if(!deletedVoter){
            return res.status(404).json({message:"Voter not found"});
        }
        res.json({message:"Voter deleted Successfully"});
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Error deleting voter",error});
    }
}


export const getAllVoters =asyncHandler(async (req,res)=>{
    try {
        const voters=await Voter.find();
        res.json(voters);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Error getting voter list",error});
    }
})