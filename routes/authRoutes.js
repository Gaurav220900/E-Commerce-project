const express = require("express");
const router = express.Router();
const User = require("../model/user");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("auth/signup");
});

router.post("/register", async (req, res) => {
  try {
    const { username, password, email, userType } = req.body;
    const user = new User({ username, email, userType });
    await User.register(user, password);
    req.flash("success", "Registered Successfully");
    res.redirect("/login");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
    failureFlash: true,
  }),
  function (req, res) {
    req.flash("success", `Welcome back again ${req.user.username}`);
    res.redirect("/products");
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Good Bye!");
    res.redirect("/login");
  });
});

module.exports = router;
