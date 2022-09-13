var express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());

// configuration ===============================================================
// app.set('port', process.env.PORT || 443); // process.env.PORT undefind;
app.set("port", 3000 || 443);

app.get("/", function (req, res, next) {
  res.send("Root");
});

var userRouter = require("./routes/user");
app.use("/api/user", userRouter);

app.use(logHandler);
app.use(errorHandler);

// logger middleware
function logHandler(err, req, res, next) {
  console.error("[" + new Date() + "]\n" + err.stack);
  next(err);
}

// error handler middleware
function errorHandler(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message || "Error!!");
}

app.listen(app.get("port"), function () {
  console.log(
    "Express server listening on port " +
      app.get("port") +
      " https://localhost:3000/"
  );
});
