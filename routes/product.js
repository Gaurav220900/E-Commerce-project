const express = require("express");
const router = express.Router();
const Product = require("../model/product");
const { isLoggedIn, isRetailer } = require("../middleware");

//show all products
router.get("/products", isLoggedIn, async (req, res) => {
  try {
    const products = await Product.find({});
    res.render("products/index", { products });
  } catch (e) {
    req.flash("error", "Cannot show all the product at the moment");
    res.redirect("/products/new");
  }
});

//create new product route
router.get("/products/new", isLoggedIn, (req, res) => {
  try {
    res.render("products/new");
  } catch (e) {
    req.flash("error", "Cannot open the create  product at the moment");
    res.redirect("/products/new");
  }
});

//show route
router.get("/products/:productid", isLoggedIn, async (req, res) => {
  try {
    const { productid } = req.params;
    const product = await Product.findById(productid).populate("reviews");
    res.render("products/show", { product });
  } catch (e) {
    req.flash("error", "Cannot show the product at the moment");
    res.redirect("/products");
  }
});

//edit route
router.get(
  "/products/:productid/edit",
  isLoggedIn,
  isRetailer,
  async (req, res) => {
    try {
      const { productid } = req.params;
      const product = await Product.findById(productid);
      res.render("products/edit", { product });
    } catch (e) {
      req.flash("error", "Cannot get the product at the moment");
      res.redirect("/products");
    }
  }
);

//update product
router.patch("/products/:productid", isLoggedIn, async (req, res) => {
  try {
    const { productid } = req.params;
    const { name, price, desc, img } = req.body;
    await Product.findByIdAndUpdate(productid, { name, price, desc, img });
    req.flash("success", "Updated the product successfully");
    res.redirect(`/products/${productid}`);
  } catch (e) {
    req.flash("error", "Cannot update the product at the moment");
    res.redirect("/products");
  }
});

//delete product
router.delete(
  "/products/:productid",
  isLoggedIn,
  isRetailer,
  async (req, res) => {
    try {
      const { productid } = req.params;
      await Product.findByIdAndDelete(productid);
      res.redirect("/products");
    } catch (e) {
      req.flash("error", "Cannot delete the product at the moment");
      res.redirect("/products");
    }
  }
);

//create a new product
router.post("/products", isLoggedIn, isRetailer, async (req, res) => {
  try {
    const { name, price, desc, img } = req.body;
    await Product.create({ name, price, desc, img });
    req.flash("success", "Product created successfully");
    res.redirect("/products");
  } catch (e) {
    req.flash("error", "Cannot create the product at the moment");
    res.redirect("/products/new");
  }
});

module.exports = router;
