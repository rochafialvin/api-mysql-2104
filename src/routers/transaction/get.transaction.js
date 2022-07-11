const express = require("express");
const { isFieldEmpties } = require("../../helpers");
const router = express.Router();
const { auth } = require("../../helpers/auth");
const pool = require("../../lib/database");
const { createHtmlString } = require("../../lib/handlebars/basic");
const htmlPdf = require("html-pdf");

const getTransactionListController = async (req, res, next) => {
  try {
    let { page, pageSize } = req.query;
    const { user_id } = req.user;

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
    const sqlGetTransactions =
      "SELECT * FROM `transaction` t WHERE user_id = ? LIMIT ? OFFSET ?";
    const dataGetTransactions = [user_id, limit, offset];
    const [resGetTransactions] = await connection.query(
      sqlGetTransactions,
      dataGetTransactions
    );

    // resGetTransactions = [{transaction_id}, {transaction_id}, {transaction_id}]

    // mappedTransactions = [{transaction_id, user_id, product}]
    const mappedTransactions = [];
    if (resGetTransactions.length) {
      // get one product for each transaction
      for (const transaction of resGetTransactions) {
        // transaction ={transaction_id, user_id}
        const sqlGetOneProduct = `SELECT product_name, product_price, product_image  FROM detailTransaction dt WHERE transaction_id = ? LIMIT 1`;
        const dataGetOneProduct = [transaction.transaction_id];
        const [resGetOneProduct] = await connection.query(
          sqlGetOneProduct,
          dataGetOneProduct
        );

        // transaction ={transaction_id, user_id, product}
        transaction.product = resGetOneProduct[0];
        mappedTransactions.push(transaction);
      }
    }

    res.send({
      status: "Success",
      message: "Transaction List",
      data: {
        result: mappedTransactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createDetailTransactionController = async (req, res, next) => {
  try {
    const data = {
      name: "james",
      email: "jeje@gmail.com",
      age: 11,
      pets: [
        { id: 1, name: "Bird" },
        { id: 2, name: "Comodo" },
        { id: 3, name: "Sea Pig" },
      ],
    };

    const htmlString = createHtmlString(data);

    htmlPdf.create(htmlString, { format: "A4" }).toStream((error, stream) => {
      if (error) throw error;

      stream.pipe(res);
    });
  } catch (error) {
    next(error);
  }
};

router.get("/", auth, getTransactionListController);
router.get("/print", createDetailTransactionController);

module.exports = router;
