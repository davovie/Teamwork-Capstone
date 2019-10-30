/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */
/* eslint arrow-parens: ["error", "as-needed"] */
/* eslint-env es6 */

const promise = require("bluebird");

const options = {
  promiseLib: promise
};
const pgp = require("pg-promise")(options);

const connectString = "postgres://postgres:buianhtu@localhost:5432/quanlysv";
const db = pgp(connectString);

// SQL query to post /auth/create-user
function createEmployee(req, res, next) {
  db.one(
    "INSERT INTO employee(firstName, lastName, email, password, gender, jobRole, department, address) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING employeesId",
    [
      req.params.firstName,
      req.params.lastName,
      req.params.email,
      req.params.password,
      req.params.gender,
      req.params.jobRole,
      req.params.department,
      req.params.address
    ]
  )
    .then(value => {
      res.status(201).json({
        status: "success",
        data: {
          message: "User account successfully created",
          token: "",
          userId: value.employeeId
        }
      });
    })
    .catch(err => next(err));
}

// SQL query to POST /auth/sigin
function signin(req, res, next) {
  db.any(
    "SELECT * FROM employee WHERE email = $(email) AND password = $(password)",
    {
      email: req.params.email,
      password: req.params.password
    }
  )
    .then(value => {
      res.status(200).json({
        status: "success",
        data: {
          token: "",
          userId: value.id
        }
      });
    })
    .catch(err => next(err));
}

// SQL query to POST /gifs
function createGif(req, res, next) {
  db.any("INSERT INTO $1~($2~)($3~) VALUES(req.params.url, req.params.title)", [
    "Gif",
    "imageUrl",
    "title"
  ])
    .then(value => {
      res.status(200).json({
        status: "success",
        data: {
          message: "GIF image successfully posted”",
          createdOn: value.date,
          title: value.title,
          imageUrl: value.imageUrl
        }
      });
    })
    .catch(err => next(err));
}

// SQL query for POST /articles
function createArticle(req, res, next) {
  db.none(
    "INSERT INTO article(title, article) VALUES($(title), $(article)) RETURNING articleId",
    [req.body.title, req.body.article]
  )
    .then(value => {
      res.status(201).json({
        status: "success",
        data: {
          message: "Article successfully posted",
          articleId: value.articleId,
          createdOn: value.date,
          title: value.title
        }
      });
    })
    .catch(err => next(err));
}

module.exports = {
  createEmployee,
  signin,
  createGif,
  createArticle
};
