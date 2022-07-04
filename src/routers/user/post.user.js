const express = require("express");
const router = express.Router();
const { isFieldEmpties } = require("../../helpers");
const pool = require("../../lib/database");
const { hash } = require("../../lib/bcryptjs");

const registerUserController = async (req, res) => {
  try {
    const { username, email, password } = req.body; // dari client

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

    // username: bean
    // email : bean@mail.com
    // check username and email
    const sqlGetUser = `SELECT username, email FROM user WHERE username = ? OR email = ?`;
    const dataGetUser = [username, email];

    // username : rochafi , email : green@mail.com

    // username : bean, email : hatori@mail.com
    // username : senku , email : dark@mail.com
    // username : alvin , email: green@mail.com

    // resGetUser: [ { username : alvin , email: green@mail.com } ]
    const [resGetUser] = await connection.query(sqlGetUser, dataGetUser);

    // jika mendapatkan user berdasarkan username atau email
    if (resGetUser.length) {
      const user = resGetUser[0];

      // jika username dari database sama dengan username yang masuk dari client
      if (user.username == username) {
        return res.send({
          status: "Error",
          message: "Username is already exists",
        });

        // jika username yg masuk tidak cocok, bisa dipastikan emailnya cocok
      } else {
        return res.send({
          status: "Error",
          message: "Email is already exists",
        });
      }
    }

    // hash password
    const encryptedPassword = hash(password);

    const sqlCreateUser = `INSERT INTO user SET ?`;
    // username, email, password adalah nama kolom yang ada di table user, tidak bisa sembarang
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
    res.send({
      status: "Error",
      message: error.message,
    });
  }
};
router.post("/", registerUserController);

module.exports = router;
