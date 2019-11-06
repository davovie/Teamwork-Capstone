
const express = require("express");
const moment = require('moment');
const teamworkQuery = require('../controllers/queries');
const routeAuth = require("../auth/auth");

const router = express.Router();

// employees can post gifs
router.post("/gifs", routeAuth.auth, teamworkQuery.createGif);

// employees can post articles
router.post("/articles", routeAuth.auth, teamworkQuery.createArticle);

// employees can comment on other colleagues' article post
router.post("/articles/:articleid/comment", (req, res, next) => {
  res.status(201).json({
    status: "success",
    data: {
      message: "Comment successfully created",
      createdOn: moment().format("MMMM Do YYYY, h:mm:ss a"),
      articleTitle: "",
      article: "",
      comment: ""
    }
  });
});

// employees can comment on other colleagues' gif post
router.post("/gifs/:gifid/comment", (req, res, next) => {
  res.status(201).json({
    status: "success",
    data: {
      message: "Comment successfully created",
      createdOn: moment().format("MMMM Do YYYY, h:mm:ss a"),
      gifTitle: "",
      comment: ""
    }
  });
});

// employees can edit their articles
router.patch("/articles/:articleid", routeAuth.auth, teamworkQuery.editArticle);

// employees can delete their articles
router.delete("/articles/:articleid", routeAuth.auth, teamworkQuery.deleteArticle);

// employees can delete their gifs
router.delete("/gifs/:gifid", routeAuth.auth, teamworkQuery.deleteGif);

router.get("/", (req, res) => {
  res.json({ message: "Server starts successfully!" });
});

module.exports = router;
