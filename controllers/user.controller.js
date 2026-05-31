import pool from "../config/db.js";
import supabase from "../config/supabase.js";
import { InternalServer, BadRequest } from "../errors/errors.error.js";

export const updateAvatar = async (req, res, next) => {
  try {
    const user = req.user;
    const file = req.file;

    const filename = Date.now() + "-" + file.originalname;

    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(filename, file.buffer, { contentType: file.mimetype });

    if (error) throw new InternalServer("Image upload failed");

    const { data: publicUrlData } = await supabase.storage
      .from("avatars")
      .getPublicUrl(data.path);

    const updatedUser = await pool.query(
      `UPDATE users SET avatar_url = $1 WHERE id = $2 RETURNING avatar_url`,
      [publicUrlData.publicUrl, user.id],
    );

    res.status(200).json({
      success: true,
      avatarUrl: updatedUser.rows[0].avatar_url,
    });
  } catch (err) {
    next(err);
  }
};

export const updateUsername = async (req, res, next) => {
  try {
    if (!req.body?.user_name) throw new BadRequest("Missing user-name");

    const user = await pool.query(
      `UPDATE users SET user_name = $1 WHERE id = $2 RETURNING user_name`,
      [req.body.user_name, req.user.id],
    );

    if (!user) throw new InternalServer("Cant uptate user-name");

    console.log(user.rows[0]);

    res.status(200).json({
      success: true,
      message: "user-name updated successfully",
      user_name: user.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/api/auth",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
};
