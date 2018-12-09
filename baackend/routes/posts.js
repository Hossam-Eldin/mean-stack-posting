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

// upload image
router.post('', multer({ storage: storage }).single('image'), 
    checkAuth,
    (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename
    });
    post.save().then((createdPost) => {
        res.status(200).json({
            message: 'post is send',
            post: {
                postId: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath,

            }
        })
    })
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
        imagePath : imagePath
    })

     console.log(post);

    Post.updateOne({ _id: req.params.id }, post).then(result => {
        console.log(result);
        res.status(200).json({ message: "Update successful!" });
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
    });

    //res.send('hello world');
});



router.delete('/:id',
    checkAuth,
     (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }).then(result => {
        console.log(result);

        res.status(200).json({
            message: 'post deleted',
        })
    })

});


module.exports = router;