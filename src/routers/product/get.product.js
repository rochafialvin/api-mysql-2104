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

    // page 1
    // pagesize : 6
    // product : 1 - 6
    // offset : 0 * 6 = 0 (tidak ada product yang dilewati)

    // page 2
    // pagesize : 6
    // product : 7 - 12
    // offset : 1 * 6 = 6 (6 product yang di lewati)

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

router.get("/", auth, getProductListController);

module.exports = router;
