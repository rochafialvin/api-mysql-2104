const handlebars = require("handlebars");
const fs = require("fs");
const appRoot = require("app-root-path");

const createHtmlString = (data) => {
  const templatePath = `${appRoot}/src/lib/handlebars/template/test.html`;

  const htmlSource = fs.readFileSync(templatePath, "utf-8");

  const htmlTemplate = handlebars.compile(htmlSource);

  const htmlString = htmlTemplate(data);

  return htmlString;
};

module.exports = { createHtmlString };
