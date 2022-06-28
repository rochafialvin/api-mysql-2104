const express = require("express");
const app = express();
const port = 2104;
const pool = require("./lib/database");

app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("API JALAN KOK");
});

app.get("/noodles", async (req, res) => {
  try {
    const connection = pool.promise();
    const sqlGetNoodles = "SELECT * FROM product";

    const [resGetNoodles] = await connection.query(sqlGetNoodles);

    res.send({
      status: "Success",
      message: "List of noodles",
      data: {
        result: resGetNoodles,
      },
    });
  } catch (error) {
    res.send({ error });
  }
});

app.listen(port, (error) => {
  if (error) return console.log({ err: error.message });
  console.log(`API berhasil running di port ${port}`);
});
