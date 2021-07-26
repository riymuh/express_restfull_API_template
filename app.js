var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// var authMiddleware = require("./middleware/auth");
var { authJwt } = require("./middleware/");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var postsRouter = require("./routes/posts");
var authRouter = require("./routes/auth.routes");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//Router
app.use("/", indexRouter);
app.use("/auth/", authRouter);
app.use("/users", [authJwt.verifyToken], usersRouter);
app.use("/posts", postsRouter);

//Router

// catch 404 and forward to error handler
app.use(function (err, req, res, next) {
  //next(createError(404));
  res.status(404).json({
    status: "ERROR",
    messages: err,
    data: {},
  });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
