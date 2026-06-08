import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.middleware.js";
import { NotFound } from "./errors/errors.error.js";

import AuthRouter from "./routes/auth.route.js";
import UserRouter from "./routes/user.route.js";
import CartRouter from "./routes/cart.route.js";

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", AuthRouter);
app.use("/api", UserRouter);
app.use("/api/cart", CartRouter);

app.get("/status", (req, res) => {
  res.status(200).json({
    success: true,
    message: "server is up and runing",
    uptime: process.uptime(),
    timestamp: new Date().toString(),
  });
});

app.use((res, req, next) => {
  throw new NotFound();
});

app.use(errorHandler);

export default app;
