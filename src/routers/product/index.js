const express = require("express");
const router = express.Router();

const getProductRouter = require("./get.product");

router.use(getProductRouter);

module.exports = router;
