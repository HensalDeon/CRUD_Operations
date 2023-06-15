var express = require("express");
var router = express.Router();
var productHelper = require("../helpers/product-helpers.js");
var userHelper = require("../helpers/user-auth.js");

/* GET home page. */

const loginValidator = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect("/login");
    }
};

router.get("/", loginValidator, function (req, res, next) {
    let user = req.session.user;
    productHelper.getAllProducts().then((products) => {
        res.render("user/home", { products, user });
    });
});

router.get("/login", (req, res) => {
    if (req.session.user) {
        res.redirect("/");
    } else {
        res.render("user/login", { loginErr: req.session.logginErr });
        req.session.logginErr = null;
    }
});

router.get("/signup", (req, res) => {
    if (req.session.user) {
        res.redirect("/");
    } else {
        res.render("user/signUp");
    }
});

router.post("/signup", (req, res) => {
    userHelper.doSignup(req.body).then((message) => {
        if (message.error) {
            res.status(409).render("user/signUp", { message });
        } else {
            // res.status(200).redirect("/login");
            res.status(200).render("user/login", { message });
        }
    });
});

router.post("/login", (req, res) => {
    userHelper.doLogin(req.body).then((response) => {
        if (response.status) {
            // console.log(response.status)
            req.session.loggedIn = true;
            req.session.user = response.user;
            req.session.logginErr = false;
            res.redirect("/");
        } else {
            req.session.logginErr = response.logginErr;
            res.redirect("/login");
        }
    });
});

// router.get("/cart", (req, res) => {
//     res.render("user/cart");
// });

router.get("/about", (req, res) => {
    res.render("user/about");
});

router.get("/products", (req, res) => {
    res.redirect("/");
});

// router.get("/product", (req, res) => {
//     res.render("user/product");
// });

// router.get("/logout", (req, res) => {
//     req.session.destroy();
//     res.redirect("/login");
// });
router.get("/logout", (req, res) => {
    req.session.loggedIn = false;
    req.session.user = null;
    res.redirect("/login");
});

module.exports = router;
