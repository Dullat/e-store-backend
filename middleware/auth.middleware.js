import { BadRequest, Unauthorized } from "../errors/errors.error.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const protect = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken || "";

    if (!accessToken) throw new Unauthorized("No access token is provided");

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      throw new Unauthorized("Invalid or expired token");
    }
  } catch (err) {
    next(err);
  }
};
