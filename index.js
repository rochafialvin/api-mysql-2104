const express = require("express");
const app = express();
const port = 2104;

// agar dapat membaca body yang dikirim
app.use(express.json());

const users = [
  { id: 12, username: "max" },
  { id: 23, username: "john" },
  { id: 30, username: "smith" },
];

app.get("/", (req, res) => {
  res.send("API JALAN KOK");
});

// create user baru
app.post("/users", (req, res) => {
  // req.body --> berisi body yang dikirim dari client
  const newUser = req.body;
  users.push(newUser);

  res.send({
    status: "Success",
    message: "Success create new user",
  });
});

// get user id
app.get("/users", (req, res) => {
  res.send({
    status: "Success",
    message: "User list",
    data: {
      result: users,
    },
  });
});

// get user id
app.get("/users/:id", (req, res) => {
  // req.params --> berisi path variable
  const { id } = req.params;

  const filteredUser = users.filter((user) => user.id == parseInt(id));

  res.send({
    status: "Success",
    message: "User by id",
    data: {
      result: filteredUser,
    },
  });
});

// get user by id

app.listen(port, (error) => {
  if (error) return console.log({ err: error.message });
  console.log(`API berhasil running di port ${port}`);
});
