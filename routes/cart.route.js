import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  addToCart,
  removeFromCart,
  getCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.route("/add-to-cart").post(protect, addToCart);
router.route("/remove-from-cart").post(protect, removeFromCart);
router.route("/get-cart").get(protect, getCart);

export default router;
