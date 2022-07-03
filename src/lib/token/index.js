const jwt = require("jsonwebtoken");
require("dotenv").config();

const createToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET);
const verifyToken = (payload) => jwt.verify(payload, process.env.JWT_SECRET);

module.exports = { createToken, verifyToken };
