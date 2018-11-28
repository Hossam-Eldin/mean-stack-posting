const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/post');
const mongoose = require('mongoose');

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

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
});


app.post('/api/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
    });
    post.save().then((createdPost) => {
        res.status(200).json({
            message: 'post is send',
            postId: createdPost._id
        })
    })
    // console.log(post);

})



app.get('/api/posts', (req, res, next) => {
    Post.find().then(documents => {
        res.status(200).json({
            message: 'succesfully fetched the data',
            posts: documents
        });
    });

    //res.send('hello world');
});

app.delete('/api/posts/:id', (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }).then(result => {
        console.log(result);

        res.status(200).json({
            message: 'post deleted',
        })
    })

});

module.exports = app;