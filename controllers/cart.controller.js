import pool from "../config/db.js";
import { BadRequest, NotFound } from "../errors/errors.error.js";

export const addToCart = async (req, res, next) => {
  try {
    const { game_id, game_name, game_bg } = req.body;

    if (!game_id || !game_name || !game_bg)
      throw new BadRequest("Missing game data");

    let cart = await pool.query(`SELECT id FROM carts WHERE user_id = $1`, [
      req.user.id,
    ]);

    if (cart.rows.length < 1) {
      cart = await pool.query(
        `INSERT INTO carts (user_id) VALUES ($1) RETURNING id`,
        [req.user.id],
      );
    }

    await pool.query(
      `INSERT INTO cart_items (cart_id, game_id, game_name, game_bg) values($1, $2, $3, $4)`,
      [cart.rows[0].id, game_id, game_name, game_bg],
    );

    res.status(201).json({
      success: true,
      message: "item added into cart successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { id: game_id } = req.params;

    if (!game_id) throw new BadRequest("Missing game id");

    await pool.query(`DELETE FROM cart_items WHERE game_id = $1`, [game_id]);

    res.status(200).json({
      success: true,
      message: "Removed from cart",
    });
  } catch (err) {
    next(err);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await pool.query(
      `select
  ci.game_id,
  ci.game_name,
  ci.game_bg,
  ci.added_at
from cart_items ci
join carts c
  on c.id = ci.cart_id
where c.user_id = $1`,
      [req.user.id],
    );

    res.status(200).json({
      success: true,
      cart: cart.rows,
    });
  } catch (err) {
    next(err);
  }
};
