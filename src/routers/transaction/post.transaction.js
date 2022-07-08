const express = require("express");
const { isFieldEmpties } = require("../../helpers");
const router = express.Router();
const { auth } = require("../../helpers/auth");
const pool = require("../../lib/database");

const createTransactionController = async (req, res, next) => {
  try {
    res.status(201).send("Create transaction endpoint is ready");
  } catch (error) {
    next(error);
  }
};

router.post("/", auth, createTransactionController);

module.exports = router;
