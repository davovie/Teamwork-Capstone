const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./db");

// const cloudinary = require('cloudinary').v2;

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
        "INSERT INTO employee(firstname, lastname, email, password, gender, job_role, department, address) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING employeeid",
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
        const userToken = jwt.sign(
          { userid: value.employeeid },
          "RANDOM_TOKEN_SECRET",
          {
            expiresIn: "24h"
          }
        );
        res.status(201).json({
          status: "success",
          data: {
            message: "User account successfully created",
            token: userToken,
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
  // Retrieve all values from database where email match
  db.one("SELECT  * FROM employee WHERE email = $(email)", { email })
    .then(value => {
      // compare recieved email address with database value
      if (value.email !== email) {
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
          const userToken = jwt.sign(
            { userid: value.employeeid },
            "RANDOM_TOKEN_SECRET",
            { expiresIn: "1h" }
          );
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
  const { title, image, date } = req.body;
  db.one({
    text:
      "INSERT INTO gif (title, image_url, date_created, authorid) VALUES($1, $2, $3, $4) RETURNING gifid, title, image_url, date_created",
    values: [title, image, date, req.auth]
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
  const { title, article } = req.body;
  db.one({
    text:
      "INSERT INTO article(title, article, authorid) VALUES($1, $2, $3) RETURNING title, date_created, articleId",
    values: [title, article, req.auth]
  })
    .then(value => {
      res.status(201).json({
        status: "success",
        data: {
          message: "Article successfully posted",
          articleId: value.articleid,
          createdOn: value.date_created,
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
  const { title, article } = req.body;
  const { articleid } = req.params;
  const authorid = req.auth;
  db.one({
    text:
      "UPDATE article SET title = $1, article = $2, authorid = $3 WHERE articleid = $4 RETURNING title, article",
    values: [title, article, authorid, articleid]
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
    text: "DELETE FROM article WHERE articleId = $1",
    values: [req.params.articleId]
  })
    .then(() => {
      res.status(200).json({
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
    text: "DELETE FROM gif WHERE gifid = $1",
    values: [req.params.gifid]
  })
    .then(() => {
      res.status(200).json({
        status: "success",
        data: {
          message: "gif post successfully deleted"
        }
      });
    })
    .catch(err => {
      res.status(400).json(next(err));
    });
};

// SQL query for POST /articles/<articleId>/comment
const commentArticle = (req, res, next) => {
  const { comment } = req.body;
  const authorid = req.auth;
  const { articleid } = req.params;
  db.one({
    text:
      "INSERT INTO comment (comment, authorid, articleid) VALUES ($1, $2, $3) RETURNING comment, date_created",
    values: [comment, authorid, articleid]
  })
    .then(returnedComment => {
      db.one({
        text:
          "SELECT title, article FROM article WHERE articleid = $1",
        values: [articleid]
      }).then(value => {
        res.status(201).json({
          status: "success",
          data: {
            message: "Comment successfully created",
            createdOn: returnedComment.date_created,
            articleTitle: value.title,
            article: value.article,
            comment: returnedComment.comment
          }
        });
      });
    })
    .catch(err => {
      res.status(400).json(next(err));
    });
};

// SQL query for POST /gifs/<:gifId>/comment
const commentGif = (req, res, next) => {
  const { comment } = req.body;
  const authorid = req.auth;
  const { gifid } = req.params;
  db.one({
    text:
      "INSERT INTO comment (comment, authorid, gifid) VALUES($1, $2, $3) RETURNING comment, date_created",
    values: [comment, authorid, gifid]
  })
    .then(gifComment => {
      db.one({
        text:
          "SELECT title FROM gif WHERE gifid = $1",
        values: [gifid]
      }).then(value => {
        res.status(201).json({
          status: "success",
          data: {
            message: "Comment successfully created",
            createdOn: gifComment.date_created,
            gifTitle: value.title,
            comment: gifComment.comment
          }
        });
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
