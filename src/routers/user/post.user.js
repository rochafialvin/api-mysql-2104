const express = require("express");
const router = express.Router();
const { isFieldEmpties } = require("../../helpers");
const pool = require("../../lib/database");
const { hash } = require("../../lib/bcryptjs");

const registerUserController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body; // dari client

    const emptyFields = isFieldEmpties({ username, email, password });

    if (emptyFields.length) {
      throw {
        code: 400,
        message: `Empty fields :  ${emptyFields}`,
        data: { result: emptyFields },
      };
    }

    // mendapatkan connection
    const connection = pool.promise();

    const sqlGetUser = `SELECT username, email FROM user WHERE username = ? OR email = ?`;
    const dataGetUser = [username, email];
    const [resGetUser] = await connection.query(sqlGetUser, dataGetUser);

    // jika mendapatkan user berdasarkan username atau email
    if (resGetUser.length) {
      const user = resGetUser[0];

      if (user.username == username) {
        throw {
          code: 400,
          message: "Username is already exists",
        };
      } else {
        throw {
          code: 400,
          message: "Email is already exists",
        };
      }
    }

    // hash password
    const encryptedPassword = hash(password);

    const sqlCreateUser = `INSERT INTO user SET ?`;
    const dataCreateUser = [{ username, email, password: encryptedPassword }];

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
    next(error); // error akan diteruskan ke error handler di index.js
  }
};
router.post("/", registerUserController);

module.exports = router;
