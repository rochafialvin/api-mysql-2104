const pool = require("../lib/database");

const createEmail = async () => {
  try {
    const connection = pool.promise();

    const sqlGetAllUser = `SELECT user_id, username FROM user`;
    const [resGetAllUser] = await connection.query(sqlGetAllUser);

    const sqlCreateEmail = `UPDATE user SET ? WHERE user_id = ? `;
    for (const user of resGetAllUser) {
      const dataCreateEmail = [
        { email: `${user.username}@mail.com` },
        user.user_id,
      ];
      await connection.query(sqlCreateEmail, dataCreateEmail);
    }

    console.log("Generate email success");
  } catch (error) {
    console.log({ error });
  }
};

createEmail();
