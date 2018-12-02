const express = require('express');
const path =require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const  postRouters = require('./routes/posts');

const app = express();
mongoose.connect('mongodb+srv://sam:IS1f5f8ymGVXLNTM@cluster0-crt47.mongodb.net/mean?retryWrites=true', { useNewUrlParser: true })
    .then(() => {
        console.log('connected to database');
    })
    .catch(() => {
        console.log('connection faild')
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join("baackend/images")));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});


app.use("/api/posts", postRouters);

module.exports = app;