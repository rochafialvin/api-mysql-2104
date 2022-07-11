const express = require("express");
const { isFieldEmpties } = require("../../helpers");
const router = express.Router();
const { auth } = require("../../helpers/auth");
const pool = require("../../lib/database");

const createTransactionController = async (req, res, next) => {
  let connection;
  try {
    const { user_id } = req.user;
    const { total, products } = req.body;

    // products : [ {}, {} ] -->  mappedData : [ [], [] ]

    connection = await pool.promise().getConnection();

    await connection.beginTransaction();

    // delete cart
    const sqlDeleteCart = `DELETE FROM cart WHERE user_id = ?`;
    const dataDeleteCart = [user_id];
    const [resDeleteCart] = await connection.query(
      sqlDeleteCart,
      dataDeleteCart
    );

    if (!resDeleteCart.affectedRows) throw { message: "Failed delete cart" };

    // insert to transaction
    const sqlCreateTransaction = `INSERT INTO transaction SET ?`;
    const dataCreateTransaction = [{ user_id, total }];
    const [resCreateTransaction] = await connection.query(
      sqlCreateTransaction,
      dataCreateTransaction
    );

    if (!resCreateTransaction.affectedRows)
      throw { message: "Failed create transaction" };

    // insert to detail transactions
    const sqlCreateDetailTransaction = `INSERT INTO detailTransaction (transaction_id, product_id, product_name, product_price, product_description, product_origin, product_image, quantity) VALUES ?`;
    const mappedData = products.map((product) => {
      const {
        product_id,
        quantity,
        variant,
        price,
        origin,
        image,
        description,
      } = product;
      return [
        resCreateTransaction.insertId,
        product_id,
        variant,
        price,
        description,
        origin,
        image,
        quantity,
      ];
    });
    const dataCreateDetailTransaction = [mappedData];
    const [resCreateDetailTransaction] = await connection.query(
      sqlCreateDetailTransaction,
      dataCreateDetailTransaction
    );

    if (!resCreateDetailTransaction.affectedRows)
      throw { message: "Failed create detail transaction" };

    await connection.commit();

    res.status(201).send({
      status: "Success",
      message: "Success create transaction",
    });
  } catch (error) {
    connection && connection.rollback();
    next(error);
  } finally {
    connection && connection.release(); // menunggu penjelasan mengenai connection pool
  }
};

router.post("/", auth, createTransactionController);

module.exports = router;
