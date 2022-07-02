const express = require("express");
const router = express.Router();

const postCustomerRouter = require("./post.user");

router.use(postCustomerRouter);

module.exports = router;
