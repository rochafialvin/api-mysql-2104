const express = require("express");
const app = express();
const port = 2104;
const pool = require("./lib/database");

// ROUTERS
const customerRouter = require("./routers/customer");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API JALAN MZ 🚀");
});

app.use("/customers", customerRouter);

app.listen(port, (error) => {
  if (error) return console.log({ err: error.message });
  console.log(`API berhasil running di port ${port}`);
});
