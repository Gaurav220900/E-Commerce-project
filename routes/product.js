const express = require('express');
const router = express.Router();
const Product = require('../model/product');


//show all products
router.get('/products', async(req,res) => {
    const products = await Product.find({});
    
    res.render('products/index',{ products});
});

//create new product route
router.get('/products/new',(req,res) => {
    res.render('products/new');
});

//show route
router.get('/products/:productid',async(req,res) =>{
    const {productid} = req.params;
    const product = await Product.findById(productid).populate('reviews');
    res.render('products/show',{product});
});

//edit route
router.get('/products/:productid/edit',async(req,res) => {
    const{ productid } = req.params;
    const product = await Product.findById(productid);
    res.render('products/edit', {product});
})

//update product
router.patch('/products/:productid',async(req,res) => {
    const { productid } = req.params;
    const { name, price, desc, img } = req.body;
    await Product.findByIdAndUpdate(productid, { name, price, desc, img });
   // req.flash('success', 'Updated the product successfully');
    res.redirect(`/products/${productid}`);
})


//delete product
router.delete('/products/:productid',async(req,res) => {
    const {productid} = req.params;
    await Product.findByIdAndDelete(productid);
    res.redirect('/products');
})

//create a new product
router.post('/products',async(req,res) => {
    try {
        const { name, price, desc, img } = req.body;
        await Product.create({ name, price, desc, img });
       // req.flash('success', 'Product created successfully');
        res.redirect('/products');
    }
    catch (e) {
       // req.flash('error', 'Cannot create the product at the moment');
        res.redirect('/products/new');
    }
});

module.exports = router;