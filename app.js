const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const loaclStrategy = require("passport-local");
const User = require("./model/user");

const sessionConfig = {
  secret: "nice",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
};

passport.use(new loaclStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

const productRoutes = require("./routes/product");
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(methodOverride("_method"));

mongoose
  .connect("mongodb://127.0.0.1:27017/E-commerce-website")
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("err");
  });

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.listen(3000, () => {
  console.log("server listening at port 3000");
});
