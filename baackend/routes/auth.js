const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/user');


router.post("/signup", (req, res, next) => {
    console.log(req.body.email);
    bcrypt.hash(req.body.password, 10).then(hash => {
        //  if (err) { throw (err); }

        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
            .then(result => {
                res.status(201).json({
                    message: 'user is created',
                    result: result,
                });
            })
            .catch(err => {
                res.status(500).json({
                 message : "invalid auth credentials!"
                });
            })
    })

});

// login router
router.post("/login", (req, res, next) => {
    // console.log(req.body.password);
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "Auth failed 1"
                });
            }
            fetchedUser = user;
            console.log(
                'this user password' + user.password);
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            console.log(result);
            if (!result) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            const token = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser._id },
                "secret_this_should_be_longer",
                { expiresIn: "1h" }
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id
            });
        })
        .catch(err => {
            return res.status(401).json({
               message : "invalid auth credentials!"

            });
        });

});

module.exports = router;