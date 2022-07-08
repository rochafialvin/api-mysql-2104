const express = require("express");
const { isFieldEmpties } = require("../../helpers");
const router = express.Router();
const { auth } = require("../../helpers/auth");
const pool = require("../../lib/database");

const getCartListController = async (req, res, next) => {
  try {
    res.send("Endpoint get cart is ready");
  } catch (error) {
    next(error);
  }
};

router.get("/", auth, getCartListController);

module.exports = router;
