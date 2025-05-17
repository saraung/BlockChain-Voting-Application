# 🗳️ Secure Offline Blockchain-Based Voting System

A **secure, offline, blockchain-powered voting system** that ensures transparency, integrity, and voter authentication using **face recognition** and **blockchain technology**. Built with the **MERN stack**, **Electron.js**, **Truffle**, **Ganache**, and **Python**, this application reimagines electronic voting with a focus on **security, decentralization, and usability**.

---

## 🔐 Key Features

- ✅ **Offline Voting** – Prevents online fraud and tampering  
- 🔗 **Blockchain Integration** – Transparent, immutable, and auditable vote recording using Truffle & Ganache  
- 🧠 **Face Recognition Authentication** – Secures identity verification via Python-based biometric matching  
- 🪪 **Aadhar + Voter ID Login** – Multi-factor identity authentication  
- 🧑‍💼 **Admin Panel** – Start/stop elections, manage candidates, view real-time results  
- 💻 **Desktop App** – Built with Electron.js for seamless cross-platform offline use  
- 🧩 **MERN Stack** – Modular and scalable design using MongoDB, Express.js, React, Node.js  

---

## 🖼️ System Architecture

```
+----------------+       +----------------+       +------------------------+
| Voter Desktop  | <---> | Node.js Server | <---> | Blockchain (Ganache)   |
| App (Electron) |       | + Express API  |       | via Truffle Framework  |
+----------------+       +----------------+       +------------------------+
       |                                               ^
       |                                               |
       v                                               |
+----------------+                                     |
| Face Auth via  | <-----------------------------------+
| Python Backend |
+----------------+
```

---

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js & npm
- Python 3
- Ganache (GUI or CLI)
- MongoDB
- Truffle
- Electron.js

### 🔧 Installation

1. **Clone the repository**  
```bash
git clone https://github.com/yourusername/secure-blockchain-voting.git
cd secure-blockchain-voting
```

2. **Install dependencies**

- Frontend:
  ```bash
  cd frontend
  npm install
  ```

- Backend:
  ```bash
  cd ../backend
  npm install
  ```

- Python face auth:
  Ensure required Python packages (e.g., `face_recognition`, `opencv-python`) are installed:
  ```bash
  pip install -r requirements.txt
  ```

---

## 🧪 Running the Application

1. **Start the blockchain (Ganache must be running)**
   ```bash
   truffle migrate
   ```

2. **Run the backend**
   ```bash
   cd backend
   nodemon server.js
   ```

3. **Run the face authentication backend**
   ```bash
   python face_recognition.py
   ```

4. **Run the frontend**
   ```bash
   cd frontend
   npm run dev
   ```

---

## 📸 Face Authentication

- Uses pre-stored biometric images to authenticate users.
- Ensures that only legitimate voters are granted access to the voting interface.
- Communicates with the backend via API to match live webcam input with stored data.

---

## ⚙️ Admin Panel Features

- Login authentication
- Add/manage candidates
- Start/stop election cycle
- View real-time voting results securely from the blockchain

---

## 📦 Tech Stack

| Layer             | Technologies                               |
|------------------|--------------------------------------------|
| Frontend         | React.js, Tailwind CSS                     |
| Backend          | Node.js, Express.js, MongoDB               |
| Desktop App      | Electron.js                                |
| Blockchain       | Truffle, Ganache (Ethereum)                |
| Authentication   | Python, face_recognition, OpenCV           |

---

## 📚 Future Improvements

- Integration with national voter database
- Enhanced UI/UX with real-time stats
- Role-based access controls
- Biometric hardware integration

---

## 📄 License

This project is licensed under the MIT License.  
Feel free to contribute, fork, or report issues!

---

## 🙌 Acknowledgements

- [Truffle Suite](https://trufflesuite.com/)
- [Electron.js](https://www.electronjs.org/)
- [face_recognition Python Library](https://github.com/ageitgey/face_recognition)

---

> 🎯 *A revolutionary step towards tamper-proof, decentralized, and user-friendly electoral systems.*
