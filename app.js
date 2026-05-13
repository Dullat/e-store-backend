import express from "express";
import errorHandler from "./middleware/errorHandler.middleware.js";
import { NotFound } from "./errors/errors.error.js";

const app = express();

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
