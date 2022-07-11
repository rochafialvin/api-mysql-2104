const express = require("express");
const router = express.Router();

const postTransactionRouter = require("./post.transaction");
const getTransactionRouter = require("./get.transaction");

router.use(postTransactionRouter);
router.use(getTransactionRouter);

module.exports = router;
