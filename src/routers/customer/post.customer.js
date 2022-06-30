const express = require("express");
const router = express.Router();

const registerCustomerController = (req, res) => {
  res.send("Endpoint Register Customer berhasil disetup");
};

router.post("/", registerCustomerController);

module.exports = router;
