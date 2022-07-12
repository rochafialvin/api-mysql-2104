const handlebars = require("handlebars");
const fs = require("fs");
const appRoot = require("app-root-path");

const createHtmlString = (data) => {
  /*
    const data = {
      user: { user_id, username, first_name, last_name, email, phone },
      products: resGetTransaction,
    };
  */

  // templateData = {user_id, username, first_name, last_name, email, phone, fullName, products}
  const templateData = {
    ...data.user,
    fullName: `${data.user.first_name} ${data.user.last_name}`,
    products: data.products,
  };

  const templatePath = `${appRoot}/src/lib/handlebars/template/test.html`;

  const htmlSource = fs.readFileSync(templatePath, "utf-8");

  const htmlTemplate = handlebars.compile(htmlSource);

  const htmlString = htmlTemplate(templateData);

  return htmlString;
};

module.exports = { createHtmlString };
