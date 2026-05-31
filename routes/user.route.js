import express from "express";
import upload from "../middleware/multer.js";
import { updateAvatar } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const router = express.Router();

router
  .route("/user/update-avatar")
  .post(protect, upload.single("image"), updateAvatar);

export default router;
