import jwt from "jsonwebtoken";

const createToken = (res, userId) => {
    if (!userId || !process.env.JWT_SECRET) {
        throw new Error("Missing required parameters or environment variables.");
    }

    // Generate the JWT
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });

    // Set the cookie
    res.cookie("jwt", token, {
        httpOnly: true, // Prevent access to the cookie via JavaScript
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Cross-origin for production
        maxAge: 30 * 24 * 60 * 60 * 1000, // Expiration time: 30 days in milliseconds
    });

    return token;
};

export default createToken;
