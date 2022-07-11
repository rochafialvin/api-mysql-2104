const express = require("express");
const { isFieldEmpties } = require("../../helpers");
const router = express.Router();
const { auth } = require("../../helpers/auth");
const pool = require("../../lib/database");

const getCartListController = async (req, res, next) => {
  try {
    const { user_id } = req.user;

    const connection = pool.promise();
    const sqlGetCart = `SELECT 
      cart_id, product_id, quantity, description,
      variant, price, origin, image, (quantity * price) total
    FROM cart c
    JOIN product p USING(product_id)
    WHERE c.user_id = ? `;
    const dataGetCart = [user_id];
    const [resGetCart] = await connection.query(sqlGetCart, dataGetCart);

    if (!resGetCart.length) throw { message: "Cart is empty" };

    const total = resGetCart.reduce((a, b) => a + b.total, 0);

    res.send({
      status: "Success",
      message: "Cart List",
      data: {
        result: resGetCart,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

router.get("/", auth, getCartListController);

module.exports = router;
