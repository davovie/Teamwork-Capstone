const promise = require("bluebird");

// Loading and Initializing the library
const initOptions = {
  promiseLib: promise // overriding the default (ES6 Promise)
};

const pgp = require("pg-promise")(initOptions);

// Preparing the connection details:
const connectString = "postgres://postgres:password@localhost:5432/travis_ci_test";

// Creating a new database instance from the connection details:
const db = pgp(connectString);

// Exporting the database object for shared use:
module.exports = db;
