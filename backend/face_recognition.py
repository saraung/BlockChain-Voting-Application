from flask import Flask, request, jsonify
import numpy as np
import cv2
import pymongo
import base64
import os
from dotenv import load_dotenv
from insightface.app import FaceAnalysis
from flask_cors import CORS

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI")
client = pymongo.MongoClient(MONGO_URI)
db = client["voting"]
users_collection = db["facedata"]

# Load Face Recognition Model
face_app = FaceAnalysis(name="buffalo_l")
face_app.prepare(ctx_id=0, det_size=(640, 640))

def extract_embeddings(image_base64):
    """Extract face embeddings from a base64-encoded image."""
    try:
        image_bytes = base64.b64decode(image_base64.split(",")[1])
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        faces = face_app.get(img)
        if not faces:
            return None

        return faces[0].normed_embedding.tolist()
    except Exception as e:
        print("❌ Error extracting embeddings:", e)
        return None

@app.route("/register", methods=["POST"])
def register():
    """Register a new user with face authentication."""
    data = request.json
    username = data.get("username")
    email = data.get("email")
    image_data = data.get("image")

    # Validate input
    if not username or not email or not image_data:
        return jsonify({"error": "Missing username, email, or image"}), 400

    # Ensure email is unique
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 409

    # Ensure username is unique
    if users_collection.find_one({"username": username}):
        return jsonify({"error": "Username already exists"}), 409

    embeddings = extract_embeddings(image_data)
    if embeddings is None:
        return jsonify({"error": "No face detected"}), 400

    # Insert user
    users_collection.insert_one({"username": username, "email": email, "embedding": embeddings})
    return jsonify({"message": f"✅ {username} registered successfully!"}), 201

@app.route("/login", methods=["POST"])
def login():
    """Authenticate user using face recognition."""
    data = request.json
    username = data.get("username")
    image_data = data.get("image")

    if not username or not image_data:
        return jsonify({"error": "Missing username or image"}), 400

    embeddings = extract_embeddings(image_data)
    if embeddings is None:
        return jsonify({"error": "No face detected"}), 400

    user = users_collection.find_one({"username": username})
    if not user:
        return jsonify({"error": "User not found"}), 404

    stored_embedding = np.array(user["embedding"])
    input_embedding = np.array(embeddings)

    similarity = np.dot(stored_embedding, input_embedding) / (np.linalg.norm(stored_embedding) * np.linalg.norm(input_embedding))

    if similarity > 0.8:
        return jsonify({"message": "✅ Authentication successful!"}), 200
    else:
        return jsonify({"error": "❌ Face does not match"}), 401

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
