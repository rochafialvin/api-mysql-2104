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
// axios.post("/users", { id: 3, username: "Yuri" });
app.post("/users", (req, res) => {
  // req.body --> berisi body yang dikirim dari client
  const newUser = req.body;
  users.push(newUser);

  res.send({
    status: "Success",
    message: "Success create new user",
  });
});

// get all user
// axios.get("/users", {params: {username: 'max'}});
app.get("/users", (req, res) => {
  // req.query --> menyimpan data yang dikirim dari {params : {...}}
  const { username } = req.query;

  // data --> [{} {} {}]
  let data = [...users];

  if (username) {
    // filteredUsers --> [ {} ]
    const filteredUsers = data.filter((user) => user.username == username);
    // data --> [ {} ]
    data = [...filteredUsers];
  }

  res.send({
    status: "Success",
    message: "User list",
    data: {
      result: data,
    },
  });
});

// get user id
// axios.get("/users/23");
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

// delete by id
// /users/23
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  const index = users.findIndex((user) => user.id == id);
  users.splice(index, 1);

  res.send({
    status: "Success",
    message: "Delete user success",
  });
});

// patch by id (username)
app.patch("/users/:id", (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  const index = users.findIndex((user) => user.id == id);

  users[index].username = username;

  res.send({
    status: "Success",
    message: "Update user success",
  });
});

app.listen(port, (error) => {
  if (error) return console.log({ err: error.message });
  console.log(`API berhasil running di port ${port}`);
});
