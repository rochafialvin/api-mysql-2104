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
    const { user_id, username, first_name, last_name, email, phone, age } =
      req.user;
    const { transactionId } = req.params;

    const connection = pool.promise();
    const sqlGetTransaction = `SELECT
      product_id , product_name, product_origin, product_price
    FROM detailTransaction dt
    WHERE transaction_id = ?`;
    const dataGetTransaction = [transactionId];
    const [resGetTransaction] = await connection.query(
      sqlGetTransaction,
      dataGetTransaction
    );

    if (!resGetTransaction.length) {
      throw {
        message: "Can not get products",
      };
    }

    const data = {
      user: { user_id, username, first_name, last_name, email, phone, age },
      products: resGetTransaction,
    };

    const htmlString = createHtmlString(data);

    htmlPdf.create(htmlString, { format: "A4" }).toStream((error, stream) => {
      if (error) throw error;

      stream.pipe(res);
    });

    // const pdfPath = appRoot + "/src/lib/handlebars/result/result.pdf";
    // htmlPdf
    //   .create(htmlString, { format: "A4" })
    //   .toFile(pdfPath, (err, result) => {
    //     if (err) throw err;

    //     res.download(pdfPath);
    //   });
  } catch (error) {
    next(error);
  }
};

router.get("/", auth, getTransactionListController);
router.get("/:transactionId/print", auth, createDetailTransactionController);

module.exports = router;
