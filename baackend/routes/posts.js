const express = require('express');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth'); 

const router = express.Router();


const Post = require('../models/post');

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, "baackend/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname
            .toLowerCase()
            .split(" ")
            .join("-");
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + "-" + Date.now() + "." + ext);
    }
});

//const upload = multer({ dest: 'baackend/images/'});

// create post
router.post('', multer({ storage: storage }).single('image'), 
    checkAuth,
    (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId 
    });

    post.save().then((createdPost) => {
        res.status(200).json({
            message: 'post is send',
            post: {
                postId: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath,
               creator: createdPost.creator 
            }
        })
    }).catch(error =>{
        res.status(500).json({message: "creating  post faild" });
    });
    // console.log(post);
})

//edit post by id 
router.put('/:id',
  multer({ storage: storage }).single('image'), 
  checkAuth,
 (req, res, next) => {
   // console.log(req.file);
   let imagePath = req.body.imagePath; 
    if( req.file){
        const url = req.protocol + '://' + req.get('host');
        imagePath =   url + '/images/' + req.file.filename

    }
  
   // console.log(imagePath);
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath : imagePath,
        creator: req.userData.userId
    })

    // console.log(post);

    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
        if (result.nModified > 0) {
            res.status(200).json({ message: "Update successful!" });
        }else{
            res.status(401).json({ message: "Update Failed unauthorized!" });
        }
    }).catch(error =>{
        res.status(500).json({message: "couldent update post!" });
    });
});



//get post by id
router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'post not found' })
        }
    }).catch(error =>{
        res.status(500).json({message: "fetching post faild" });
    })
})


//get all posts 
router.get('', (req, res, next) => {
   
    //pagination
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery
        .skip(pageSize * (currentPage -1))
        .limit(pageSize);
    }

    postQuery.then(documents => {
        fetchedPosts = documents;
        return Post.count();
    }).then(count => {
        res.status(200).json({
            message: 'succesfully fetched the data',
            posts: fetchedPosts,
            maxPosts: count
        });
    }).catch(error =>{
        res.status(500).json({message: "geting all post faild" });
    });

    //res.send('hello world');
});



router.delete('/:id',
    checkAuth,
     (req, res, next) => {
    Post.deleteOne({ _id: req.params.id ,  creator: req.userData.userId})
    .then(result => {
        if (result.n > 0) {
            res.status(200).json({ message: "deletion successful!" });
        }else{
            res.status(401).json({ message: "deletion Failed unauthorized!" });
        }
    }).catch(error =>{
        res.status(500).json({message: "deleteing  post faild" });
    })

});


module.exports = router;