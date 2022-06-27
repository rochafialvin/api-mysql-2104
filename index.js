const express = require("express");
const app = express();
const port = 2104;

app.get("/", (req, res) => {
  res.send("API JALAN KOK");
});

app.get("/users", (req, res) => {
  res.send({
    status: "Success",
    data: ["Hendrickson", "Thomspon", "Topson", "Lawson"],
  });
});

app.listen(port, (error) => {
  if (error) return console.log({ err: error.message });
  console.log(`API berhasil running di port ${port}`);
});
