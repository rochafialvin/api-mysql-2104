const express = require("express");
const router = express.Router();

const postTransactionRouter = require("./post.transaction");

router.use(postTransactionRouter);

module.exports = router;
