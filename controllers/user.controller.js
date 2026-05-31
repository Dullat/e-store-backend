import pool from "../config/db.js";
import supabase from "../config/supabase.js";
import { InternalServer } from "../errors/errors.error.js";

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
