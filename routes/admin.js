var express = require("express");
var router = express.Router();
var productHelper = require("../helpers/product-helpers.js");
var adminHeleper = require("../helpers/admin-auth.js");
var path = require("path");
const userHelper = require("../helpers/user-auth.js");

const acessControl = (req, res, next) => {
    // if(req.session.adminL){
    //   req.session.adminL = false;
    // }
    if (req.session.loggedInAdmin) {
        next();
    } else {
        res.redirect("/admin/login");
    }
};

router.get("/", acessControl, (req, res, next) => {
    let adminData = req.session.adminData;
    productHelper.getAllProducts().then((products) => {
        res.render("admin/view-products", {
            products,
            admin: req.session.admin,
            adminData,
        });
    });
});

router.get("/login", (req, res) => {
    if (req.session.loggedInAdmin) {
        res.redirect("/admin/home");
    } else {
        req.session.adminL = true;
        res.render("admin/admin-login", {
            errMsg: req.session.errMsg,
            isAdmin: true,
            adminL: req.session.adminL,
        });
    }
});

router.post("/login", (req, res) => {
    adminHeleper.doLoginAdmin(req.body).then((response) => {
        if (response.status) {
            req.session.loggedInAdmin = true;
            req.session.adminData = response.admin;
            req.session.errMsg = false;
            res.redirect("/admin/home");
        } else {
            req.session.errMsg = response.errMsg;
            res.redirect("/admin/login");
        }
    });
});

router.get("/home", acessControl, (req, res) => {
    req.session.admin = true;
    res.render("admin/admin-home", { admin: req.session.admin });
});

router.get("/add-product", acessControl, (req, res) => {
    res.render("admin/add-products", {
        errMsg: req.session.errMsg,
        admin: req.session.admin,
    });
    req.session.errMsg = null;
});

router.post("/add-product", acessControl, (req, res) => {
    productHelper.addProduct(req.body, (_id) => {
        let image = req.files.image;
        image.mv(path.resolve("public", "product_images", _id + ".jpg"), (err, done) => {
            if (!err) {
                res.redirect("/admin");
            } else {
                console.log(err);
            }
        });
    });
});

router.get("/delete-product/:id", acessControl, (req, res) => {
    let paramId = req.params.id;
    productHelper.deleteProduct(paramId).then((response) => {
        res.redirect("/admin");
    });
});

router.get("/edit-product/:id", acessControl, async (req, res) => {
    let product = await productHelper.getProductDetails(req.params.id);
    res.render("admin/edit-products", { product, admin: true });
});

router.post("/edit-product", acessControl, (req, res) => {
    let _id = req.body.id;
    productHelper.updateProduct(req.body).then(() => {
        res.redirect("/admin");
        if (req.files.image) {
            let image = req.files.image;
            image.mv(path.resolve("public", "product_images", _id + ".jpg"));
        }
    });
});

// router.get("/logout", acessControl, (req, res) => {
//     req.session.destroy();
//     res.redirect("/admin/login");
// });
router.get("/logout", acessControl, (req, res) => {
    req.session.loggedInAdmin = false;
    req.session.adminData = null;
    res.redirect("/admin/login");
});


//user crud operations

router.get("/user", acessControl, (req, res) => {
    userHelper.getUserDetails().then((usersData) => {
        res.render("admin/user-list", { admin: true, usersData});
    });
});

router.get("/delete-user/:id", acessControl, (req, res) => {
    let userId = req.params.id;
    userHelper.deleteUser(userId).then(() => {
        res.redirect("/admin/user");
    });
});

router.get("/edit-user/:id", acessControl, (req, res) => {
    let userId = req.params.id;
    userHelper.editUser(userId).then((user) => {
        res.render("admin/edit-user", { user, admin: true });
    });
});

router.post("/update-user/:id", acessControl, (req, res) => {
    let userId = req.params.id;
    userHelper
        .updateUser(req.body, userId)
        .then((response) => {
            res.redirect("/admin/user");
        })
        .catch((error) => {
            console.error("Error updating user:", error);
            res.redirect("/admin/user"); // Redirect or render an error page
        });
});

router.get("/add-user", acessControl, (req, res) => {
    res.render("admin/add-user", { admin: true });
});

router.post("/add-user", acessControl, (req, res) => {
    userHelper.addUser(req.body).then(() => {
        res.redirect("/admin/user");
    });
});


router.get("/user-search", acessControl, (req, res) => {
    const searchQuery = req.query.search;
    console.log(searchQuery);
    userHelper.searchUser(searchQuery)
        .then((usersData) => {
            res.render("admin/user-list", { usersData, admin: true});
        })
        .catch((error) => {
            console.log(error.message);
            res.status(500).send("Internal server error");
        });
});
module.exports = router;
