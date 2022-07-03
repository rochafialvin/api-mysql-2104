const express = require("express");
const router = express.Router();
const { isFieldEmpties } = require("../../helpers");
const { hash } = require("../../lib/bcryptjs");
const pool = require("../../lib/database");

const registerUserController = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const emptyFields = isFieldEmpties({ username, password });

    if (emptyFields.length) {
      throw {
        status: "Error",
        code: 400,
        message: `Empty fields : ${emptyFields}`,
        data: { result: emptyFields },
      };
    }

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

    const hashedPassword = hash(password);

    const sqlCreateUser = `INSERT INTO user SET ?`;
    const dataCreateUser = [{ username, password: hashedPassword }];

    await connection.query(sqlCreateUser, dataCreateUser);

    res.status(201).send({
      status: "Success",
      message: "Success create new user",
    });
  } catch (error) {
    next(error);
  }
};
router.post("/", registerUserController);

module.exports = router;
