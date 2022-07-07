const express = require("express");
const router = express.Router();
const { auth } = require("../../helpers/auth");
const pool = require("../../lib/database");

const getProductListController = async (req, res, next) => {
  try {
    const connection = pool.promise();
    const sqlGetProducts = `SELECT product_id, variant, price, origin FROM product`;
    const [resGetProducts] = await connection.query(sqlGetProducts);

    if (!resGetProducts.length) throw { message: "Product not found" };

    res.send({
      status: "Success",
      message: "Product List",
      data: {
        result: resGetProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

router.get("/", auth, getProductListController);

module.exports = router;
