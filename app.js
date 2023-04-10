const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');


const sessionConfig = {

    secret: 'nice',
    resave: false,
    saveUninitialized: true,
    
}

app.use(session(sessionConfig));
app.use(flash());

const productRoutes = require('./routes/product');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/authRoutes');


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.engine('ejs',ejsMate);

app.use(express.urlencoded({extended: true}));
app.use(productRoutes);
app.use(reviewRoutes);
app.use(userRoutes);
app.use(methodOverride('_method'));

mongoose.connect('mongodb://127.0.0.1:27017/eshop')
.then(()=> {
    console.log("DB Connected");
})
.catch((err) => {
    console.log("err");
}) 




app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
   
});


app.listen(3000, ()=> {
    console.log("server listening at port 3000");
})
