const express = require('express');
const router = express.Router();
const Review = require('../model/review');
const Product = require('../model/product');


router.post('/products/:productid/review',async(req,res) => {
    const {productid} = req.params;
    const {rating,comment} = req.body;
    const product = await Product.findById(productid);
    const review = await Review.create({rating,comment});
    product.reviews.push(review);
    await product.save();
    res.redirect(`/products/${productid}`);

});


module.exports = router;