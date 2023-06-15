const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const logger = require("morgan");
const exphbs = require("express-handlebars");
const mongoConnect = require("./config/connection").mongoConnect;
const fileUpload = require("express-fileupload");

const userRouter = require("./routes/user");
var adminRouter = require("./routes/admin");
const app = express();

app.use(fileUpload());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
    "hbs",
    exphbs.engine({
        extname: "hbs",
        defaultLayout: "layout",
        layoutsDir: __dirname + "/views/user/",
        partialsDir: __dirname + "/views/partials/",
    })
);
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
    if (req.url === "/login") {
        res.locals.layout = "layout";
    } else if (req.url === "/signup") {
        res.locals.layout = "layout";
    } else {
        res.locals.layout = "homeLayout";
    }
    next();
});
app.use(
    session({
        secret: "secret key", // Replace with a secret key of your own
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        },
    })
);

app.use((req, res, next) => {
    res.header("Cache-Control", "no-cache,private,no-Store,must-revalidate,max-scale=0,post-check=0,pre-check=0");
    next();
});

app.use("/", userRouter);
app.use("/admin", adminRouter);


//db connection
mongoConnect();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
