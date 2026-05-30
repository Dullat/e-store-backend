import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
  refreshToken,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/get-user").get(protect, getUser);
router.route("/refresh-token").get(refreshToken);

export default router;
