const express = require("express");
const router = express.Router();
const { isFieldEmpties } = require("../../helpers");
const pool = require("../../lib/database");

const registerUserController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const emptyFields = isFieldEmpties({ username, email, password });

    if (emptyFields.length) {
      throw {
        status: "Error",
        message: `Empty fields :  ${emptyFields}`,
        data: { result: emptyFields },
      };
    }

    // mendapatkan connection
    const connection = pool.promise();

    const sqlCreateUser = `INSERT INTO user SET ?`;
    const dataCreateUser = [{ username, email, password }];

    const [resCreateUser] = await connection.query(
      sqlCreateUser,
      dataCreateUser
    );

    res.send({
      status: "Success",
      message: "Success create new user",
      data: {
        result: resCreateUser,
      },
    });
  } catch (error) {
    res.send({
      status: "Error",
      message: error.message,
    });
  }
};
router.post("/", registerUserController);

module.exports = router;
