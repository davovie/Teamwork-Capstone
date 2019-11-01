
const express = require("express");

const router = express.Router();
const teamworkQuery = require("../controllers/queries");

// admin can create an employee user account
router.post("/create-user", teamworkQuery.createUser);

// Admin/Employee can login a user
router.post("/signin", (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: { token: "", userId: 23456 }
  });
});

module.exports = router;
