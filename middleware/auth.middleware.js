import { BadRequest } from "../errors/errors.error.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const protect = async (req, res, next) => {
  try {
    const accessToken = res.cookies.accessToken;

    if (!accessToken) throw new BadRequest("No access token is provided");

    try {
      const decoded = jwt.verify(accessToken);
      req.user = decoded;
      next();
    } catch (err) {
      throw new Unauthorized("Invalid or expired token");
    }
  } catch (err) {
    next(err);
  }
};
