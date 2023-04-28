import express from "express";

const router = express.Router();

router.get("/", function (req, res, next) {
  res.send("Sample");
});

router.get("/json", function (req, res, next) {
  res.send({ title: "Title", description: "description" });
});

export default router;
