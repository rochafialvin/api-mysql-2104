const express = require("express");
const { isFieldEmpties } = require("../../helpers");
const router = express.Router();
const { auth } = require("../../helpers/auth");
const pool = require("../../lib/database");

const createCartController = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const { product_id, quantity } = req.body;

    const emptyFields = isFieldEmpties({ product_id, quantity });

    if (emptyFields.length) {
      throw {
        code: 400,
        message: `Empty fields :  ${emptyFields}`,
        data: { result: emptyFields },
      };
    }

    const connection = pool.promise();
    const sqlCreateCart = `INSERT INTO cart SET ?`;
    const dataCreateCart = [{ user_id, product_id, quantity }];
    const [resCreateCart] = await connection.query(
      sqlCreateCart,
      dataCreateCart
    );

    // affectedRows akan menyimpan integer yang menunjukkan jumlah data baru yang tergenerate
    if (!resCreateCart.affectedRows)
      throw { message: "Failed create new cart" };

    res.status(201).send({
      status: "Success",
      message: "Success create new cart",
    });
  } catch (error) {
    next(error);
  }
};

router.post("/", auth, createCartController);

module.exports = router;
