import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true }, // Optional, unique email
  hashed_username: { type: String, required: true }, // Hash for security
  faceEmbeddings: [[Number]], // Storing embeddings as an array of arrays
});

const Person = mongoose.model("Person", personSchema);
export default Person;
