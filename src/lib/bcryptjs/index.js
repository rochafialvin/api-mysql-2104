const bcrypt = require("bcryptjs");

const hash = (data) => bcrypt.hashSync(data, 10);
const compare = (data, hash) => bcrypt.compareSync(data, hash);

module.exports = { hash, compare };
