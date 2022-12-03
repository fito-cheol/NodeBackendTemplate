import express from "express";
import fs from "fs";
import cookieParser from "cookie-parser";
import cors from "cors";

import morganMiddleware from "./custom_lib/morgan_middleware.js";
import { logHandler, errorHandler } from "./custom_lib/log_middleware.js";
var app = express();

app.use(cors());
app.use(morganMiddleware);
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

registerRouters(app, "./routes");

app.use(logHandler);
app.use(errorHandler);

app.listen(app.get("port"), function () {
  console.log(
    "Express server listening on port " +
      app.get("port") +
      " http://localhost:3000/"
  );
});

function registerRouters(app, path) {
  fs.readdir(path, function (err, files) {
    if (err) return console.warn(err);
    files.forEach(function (file, idx) {
      fs.lstat(path + "/" + file, function (err, stats) {
        if (err) return console.log(err);
        if (stats.isDirectory()) {
          registerRouter(app, path + "/" + file, file);
        }
      });
    });
  });
}
function registerRouter(app, path, name) {
  import(path + "/index.js").then((apiModule) => {
    app.use("/api/" + name, apiModule.default);
  });
}
