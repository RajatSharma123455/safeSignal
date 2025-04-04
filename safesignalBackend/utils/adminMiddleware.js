import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";
import { victim, volunteer } from "../db/signupSchema.js";

configDotenv();
export default async function AdminMiddleware(req, res, next) {
  try {
    const secretKey = process.env.ACCESS_SECRET;

    // Get token from cookie OR Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new Error("You are not logged In");
    }

    const decoded = jwt.verify(token, secretKey);
    const userId = decoded._id;

    const user =
      (await victim.findById(userId)) || (await volunteer.findById(userId));

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}
