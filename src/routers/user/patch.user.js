const express = require("express");
const router = express.Router();
const { isFieldEmpties } = require("../../helpers");
const { auth } = require("../../helpers/auth");
const pool = require("../../lib/database");

const updateUserController = async (req, res, next) => {
  try {
    const { user_id } = req.user;

    res.send(`User id : ${user_id}`);
  } catch (error) {
    next(error);
  }
};

router.patch("/", auth, updateUserController);

module.exports = router;
