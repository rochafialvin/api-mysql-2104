const express = require("express");
const { isFieldEmpties } = require("../../helpers");
const router = express.Router();
const { auth } = require("../../helpers/auth");
const pool = require("../../lib/database");

const getProductListController = async (req, res, next) => {
  try {
    let { page, pageSize } = req.query;

    const emptyFields = isFieldEmpties({ page, pageSize });

    if (emptyFields.length) {
      throw {
        code: 400,
        message: `Empty fields :  ${emptyFields}`,
        data: { result: emptyFields },
      };
    }

    page = +page;
    pageSize = +pageSize;

    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    const connection = pool.promise();
    const sqlGetProducts = `SELECT product_id, variant, price, origin FROM product LIMIT ? OFFSET ?`;
    const dataGetProducts = [limit, offset];
    const [resGetProducts] = await connection.query(
      sqlGetProducts,
      dataGetProducts
    );

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

const getProductDetailController = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const connection = pool.promise();
    const sqlGetProduct = `SELECT product_id, variant, price, origin, description, image FROM product WHERE product_id = ?`;
    const dataGetProduct = [productId];
    const [resGetProduct] = await connection.query(
      sqlGetProduct,
      dataGetProduct
    );

    const product = resGetProduct[0];

    if (!product) throw { message: "Product not found" };

    res.send({
      status: "Success",
      message: "Product Detail",
      data: {
        result: product,
      },
    });
  } catch (error) {
    next(error);
  }
};

router.get("/", auth, getProductListController);
router.get("/:productId", auth, getProductDetailController);

module.exports = router;
