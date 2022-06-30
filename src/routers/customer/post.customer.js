const express = require("express");
const router = express.Router();
const { isFieldEmpties } = require("../../helpers");
const pool = require("../../lib/database");

const registerCustomerController = async (req, res) => {
  try {
    const { username, password } = req.body;

    const emptyFields = isFieldEmpties({ username, password });

    if (emptyFields.length) {
      throw {
        status: "Error",
        message: "Empty fields",
        data: { result: emptyFields },
      };
    }

    // mendapatkan connection
    const connection = pool.promise();

    const sqlCreateCustomer = `INSERT INTO customer(username, password) VALUES ('${username}', '${password}')`;

    const [resCreateCustomer] = await connection.query(sqlCreateCustomer);

    res.send({
      status: "Success",
      message: "Success create new customer",
      data: {
        result: resCreateCustomer,
      },
    });
  } catch (error) {
    res.send({
      status: "Error",
      message: error.message,
    });
  }
};
router.post("/", registerCustomerController);

module.exports = router;
