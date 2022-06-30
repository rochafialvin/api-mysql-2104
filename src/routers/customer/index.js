const express = require("express");
const router = express.Router();

const postCustomerRouter = require("./post.customer");

router.use(postCustomerRouter);

module.exports = router;
