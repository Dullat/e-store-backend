import express from "express";
import upload from "../middleware/multer.js";
import {
  updateAvatar,
  updateUsername,
  logout,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const router = express.Router();

router
  .route("/user/update-avatar")
  .patch(protect, upload.single("image"), updateAvatar);
router.route("/user/update-username").patch(protect, updateUsername);
router.route("/user/logout").get(logout);

export default router;
