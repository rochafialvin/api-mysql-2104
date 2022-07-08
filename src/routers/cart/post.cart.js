const express = require("express");
const { isFieldEmpties } = require("../../helpers");
const router = express.Router();
const { auth } = require("../../helpers/auth");
const pool = require("../../lib/database");

const createCartController = async (req, res, next) => {
  try {
    res.send("Endpoint create cart is ready");
  } catch (error) {
    next(error);
  }
};

router.post("/", auth, createCartController);

module.exports = router;
