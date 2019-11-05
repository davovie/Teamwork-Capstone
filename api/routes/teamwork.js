
const express = require("express");
const moment = require('moment');
const teamworkQuery = require('../controllers/queries');
const routeAuth = require("../auth/auth");

const router = express.Router();

// employees can post gifs
router.post("/gifs", routeAuth.auth, teamworkQuery.createGif);

// employees can post articles
router.post("/articles", (req, res, next) => {
  res.status(201).json({
    status: "success",
    data: {
      message: "Article successfully posted",
      articleId: 1,
      createdOn: moment().format("MMMM Do YYYY, h:mm:ss a"),
      title: ""
    }
  });
});

// employees can comment on other colleagues' article post
router.post("/articles/:articleId/comment", (req, res, next) => {
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
router.post("/gifs/:gifId/comment", (req, res, next) => {
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
router.patch("/articles/:articleId", (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      message: "Article successfully updated",
      title: "",
      article: ""
    }
  });
});

// employees can delete their articles
router.delete("/articles/:articleId", (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      message: "Article successfully deleted"
    }
  });
});

// employees can delete their gifs
router.delete("/gifs/:gifId", (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      message: "gif post successfully deleted"
    }
  });
});

router.get("/", (req, res) => {
  res.json({ message: "Server starts successfully!" });
});

module.exports = router;
