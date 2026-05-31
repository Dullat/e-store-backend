import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.middleware.js";
import { NotFound } from "./errors/errors.error.js";

import AuthRouter from "./routes/auth.route.js";
import UserRouter from "./routes/user.route.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", AuthRouter);
app.use("/api", UserRouter);

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
