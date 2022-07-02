const express = require("express");
const router = express.Router();
const { isFieldEmpties } = require("../../helpers");
const pool = require("../../lib/database");

const registerUserController = async (req, res) => {
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

    const sqlGetUser = `SELECT user_id FROM user WHERE username = ?`;
    const dataGetUser = [username];
    const [resGetUser] = await connection.query(sqlGetUser, dataGetUser);

    if (resGetUser.length) {
      throw {
        status: "Error",
        message: "Username is already exists",
      };
    }

    const sqlCreateUser = `INSERT INTO user SET ?`;
    const dataCreateUser = [{ username, password }];

    await connection.query(sqlCreateUser, dataCreateUser);

    res.send({
      status: "Success",
      message: "Success create new user",
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
