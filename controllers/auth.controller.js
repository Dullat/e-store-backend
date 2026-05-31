import { BadRequest, Unauthorized } from "../errors/errors.error.js";
import hashPassword from "../utils/hashPassword.js";
import comparePassword from "../utils/comparePassword.js";
import pool from "../config/db.js";
import { genAccessToken, genRefreshToken } from "../utils/genTokens.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const registerUser = async (req, res, next) => {
  try {
    const { user_name, email, password } = req.body;

    if (!user_name || !email || !password)
      throw new BadRequest("Provide all credentials");

    const alreadyExist = await pool.query(
      `SELECT email FROM users WHERE email = $1`,
      [email],
    );

    if (alreadyExist.rowCount > 0) {
      throw new BadRequest("User already exists");
    }

    const hashedPassword = await hashPassword(password);

    const user = await pool.query(
      `
        INSERT INTO users (email, user_name, password)
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      [email, user_name, hashedPassword],
    );

    res.status(200).json({
      success: true,
      message: "Successfully created",
      user: user.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new BadRequest("Invalid credentials");

    const user = await pool.query(
      `
        SELECT * FROM users WHERE email = $1;
      `,
      [email],
    );

    if (user.rowCount < 1) throw new BadRequest("User does not exist");

    const isMatch = await comparePassword(password, user.rows[0].password);

    if (!isMatch) throw new BadRequest("Invalid credentials");

    const accessToken = genAccessToken({
      user_name: user.rows[0].user_name,
      email: user.rows[0].email,
      id: user.rows[0].id,
    });

    const refreshToken = genRefreshToken({
      user_name: user.rows[0].user_name,
      email: user.rows[0].email,
      id: user.rows[0].id,
    });

    res.cookie("accessToken", accessToken, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 5,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "/api/auth",
    });

    const { password: _, ...safeUser } = user.rows[0];

    res.status(200).json({
      success: true,
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await pool.query(
      `
        SELECT *
        FROM users
        WHERE id = $1
      `,
      [userId],
    );

    if (user.rowCount < 1) {
      throw new BadRequest("User not found");
    }

    const { password: _, ...safeUser } = user.rows[0];

    res.status(200).json({
      success: true,
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
};

const refreshToken = (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) throw new Unauthorized("NO refreshToken provided");
    try {
      const decoded = jwt.verify(
        oldRefreshToken,
        process.env.JWT_REFRESH_SECRET,
      );

      const accessToken = genAccessToken({
        user_name: decoded.user_name,
        email: decoded.email,
        id: decoded.id,
      });

      const refreshToken = genRefreshToken({
        user_name: decoded.user_name,
        email: decoded.email,
        id: decoded.id,
      });

      res.cookie("accessToken", accessToken, {
        sameSite: "none",
        secure: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 5,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: "/api/auth",
      });

      res.status(201).json({
        success: true,
        message: "tokens generated",
      });
    } catch (err) {
      throw new Error(err);
    }
  } catch (err) {
    next(err);
  }
};

export { registerUser, loginUser, getUser, refreshToken };
