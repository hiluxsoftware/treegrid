"use strict";

const environment = ((options) =>
  (options.includes("--prod") && "production") ||
  (options.includes("--dev") && "development"))(process.argv);

process.on("unhandledRejection", (err) => {
  throw err;
});

require("../config/env");
