import { log } from "./log_util.js";

// logger middleware
export function logHandler(err, req, res, next) {
  log.error("[" + new Date() + "]\n" + err.stack);
  next(err);
}
// error handler middleware
export function errorHandler(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message || "Error!!");
}
