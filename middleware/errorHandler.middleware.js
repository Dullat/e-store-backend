import dotenv from "dotenv";
dotenv.config();

export default (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
    errStack: process.env.NODE_ENV === "development" ? err.stack : "",
  });
};
