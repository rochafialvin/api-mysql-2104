const mysql2 = require("mysql2");

const pool = mysql2.createPool({
  host: "localhost",
  user: "root",
  database: "noodles",
  password: "Mysql-009",
  decimalNumbers: true,
});

module.exports = pool;
