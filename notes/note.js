axios.get("/users");
axios.post("/users", { id: 3, username: "Yuri" });
axios.get("/users/23");

axios.get("/users", { params: { username: "john" } });
