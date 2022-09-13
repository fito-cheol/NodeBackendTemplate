const express = require("express");
const connection = require("../../custom_lib/db_connection");

const router = express.Router();

router.get("/", function (req, res, next) {
  res.send("Update user World");
});

router.get("/list", function (req, res, next) {
  connection.query("SELECT * from user", function (err, results, fields) {
    if (err) next(err);
    res.send(results);
  });
});

module.exports = router;
