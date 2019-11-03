const promise = require("bluebird");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// const cloudinary = require('cloudinary').v2;

// Initialize the library
const initOptions = {
  promiseLib: promise // overriding the default (ES6 Promise)
};
const pgp = require("pg-promise")(initOptions);

// for option of connection string
const connectString = "postgres://postgres:password@localhost:5432/travis_ci_test";


const db = pgp(connectString); // database instance

// SQL query to post /auth/create-user
const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(password => {
    const {
      firstName,
      lastName,
      email,
      gender,
      jobRole,
      department,
      address
    } = req.body;

    db.one({
      text:
        'INSERT INTO employee(firstname, lastname, email, password, gender, job_role, department, address) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING employeeid',
      values: [
        firstName,
        lastName,
        email,
        password,
        gender,
        jobRole,
        department,
        address
      ]
    })
      .then(value => {
        res.status(201).json({
          status: "success",
          data: {
            message: "User account successfully created",
            token: "",
            userId: value.employeeid
          }
        });
      })
      .catch(err => {
        res.status(500).json(next(err));
      });
  });
};

// SQL query to POST /auth/signin
const signin = (req, res, next) => {
  const { email, password } = req.body;
  // Retrieve eamail and password from database
  db.any({
    text: "SELECT $email, $password FROM employee"
  })
    .then(value => {
      // compare recieved email address with database value
      if (value.email === email) {
        return res.status(401).json({
          error: new Error("User not found")
        });
      }
      // Use bcrypt to compare hash of sent password with database password hash
      bcrypt
        .compare(password, value.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({
              error: new Error("Incorrect password")
            });
          }
          const userToken = jwt.sign({ routeId: value.employeeid }, "RANDOM_TOKEN_SECRET", {
            expiresIn: "24h"
          });
          res.status(200).json({
            status: "success",
            data: {
              token: userToken,
              userId: value.employeeid
            }
          });
        })
        .catch(err => {
          res.status(500).json(next(err));
        });
    })
    .catch(err => {
      res.status(500).json(next(err));
    });
};

// SQL query to POST /gifs
const createGif = (req, res, next) => {
  const { title, image, date, comment } = req.body;
  db.one({
    text:
      "INSERT INTO gif (title, image_url, date_created, comment) VALUES($1, $2, $3, $4) RETURNING gifid, title, image_url, date_created",
    values: [title, image, date, comment]
  })
    .then(value => {
      res.status(200).json({
        status: "success",
        data: {
          gifid: value.gifid,
          message: "GIF image successfully posted",
          createdOn: value.date_created,
          title: value.title,
          imageUrl: value.image_url
        }
      });
    })
    .catch(err => {
      res.status(400).json(next(err));
    });
};

// SQL query for POST /articles
const createArticle = (req, res, next) => {
  db.any({
    text:
      "INSERT INTO article(title, article) VALUES($(title), $(article)) RETURNING articleId",
    values: [req.body.title, req.body.article]
  })
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
    .catch(err => {
      res.status(400).json(next(err));
    });
};

// SQL query for PATCH /articles/<:articleId>
const editArticle = (req, res, next) => {
  db.any({
    text:
      "UPDATE article SET (title, article) VALUES($(title), $(article)) WHERE articleId = $id",
    values: [req.body.title, req.body.article, req.params.articleId]
  })
    .then(value => {
      res.status(201).json({
        status: "success",
        data: {
          message: "Article successfully updated",
          title: value.title,
          article: value.article
        }
      });
    })
    .catch(err => {
      res.status(400).json(next(err));
    });
};

// SQL query for DELETE /articles/<:articleId>
const deleteArticle = (req, res, next) => {
  db.none({
    text: "DELETE FROM article WHERE articleId = $id",
    values: [req.params.articleId]
  })
    .then(() => {
      res.status(201).json({
        status: "success",
        data: {
          message: "Article successfully deleted"
        }
      });
    })
    .catch(err => {
      res.status(400).json(next(err));
    });
};

// SQL query for DELETE /gifs/<:gifId>
const deleteGif = (req, res, next) => {
  db.none({
    text: "DELETE FROM Gif WHERE gifId = $id",
    values: [req.params.gifId]
  })
    .then(() => {
      res.status(201).json({
        status: "success",
        data: {
          message: "Article successfully deleted"
        }
      });
    })
    .catch(err => {
      res.status(400).json(next(err));
    });
};

// SQL query for POST /articles/<articleId>/comment
const commentArticle = (req, res, next) => {
  db.any({
    text: "INSERT INTO article (comment) VALUES($(comment)) WHERE id = $1", // can also be a QueryFile object
    values: [req.body.comment, req.params.articleId]
  })
    .then(value => {
      res.status(201).json({
        status: "success",
        data: {
          message: "Comment successfully created",
          createdOn: value.date,
          title: value.title,
          article: value.article,
          comment: value.comment
        }
      });
    })
    .catch(err => {
      res.status(400).json(next(err));
    });
};

// SQL query for POST /gifs/<:gifId>/comment
const commentGif = (req, res, next) => {
  db.any({
    text: "INSERT INTO Gif (comment) VALUES($(comment)) WHERE id = $1", // can also be a QueryFile object
    values: [req.body.comment, req.params.gifId]
  })
    .then(value => {
      res.status(201).json({
        status: "success",
        data: {
          message: "Comment successfully created",
          createdOn: value.date,
          title: value.title,
          article: value.article,
          comment: value.comment
        }
      });
    })
    .catch(err => {
      res.status(400).json(next(err));
    });
};

module.exports = {
  createUser,
  signin,
  createGif,
  createArticle,
  editArticle,
  deleteArticle,
  deleteGif,
  commentArticle,
  commentGif
};