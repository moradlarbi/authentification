const express = require('express');
const bodyParser = require('body-parser');
const Users = require("../models/user.js")
const userRouter = express.Router();
const authenticate = require("../authenticate.js")
userRouter.use(bodyParser.json());

userRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    Users.find()
    .then(users => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users)
    })
    .catch(err => {
        res.statusCode = 403;
        res.end(err)
    })
})
.post(authenticate.verifyUser ,(req, res, next) => {
    var newUser = new Users({
        username: req.body.username,
        password: req.body.password
    })
    newUser.save()
        .then((user) => {
            console.log(user);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.send(user)
        })
        .catch(err => {
            console.log(err.message)
            res.statusCode = 404
            res.send(err.message)
        })
        
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /user');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Users.deleteMany({}, function(err, result) {
        if (err) {
          res.statusCode = 403
          res.send(err);
        } else {
          res.send(result);
        }
      });
});
userRouter.route('/:userId')
.get((req,res,next) => {
    Users.findById(req.params.userId)
    .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /user/'+ req.params.userId);
})
.put((req, res, next) => {
    Users.findByIdAndUpdate(req.params.userId, {
        $set: req.body
    }, { new: true })
    .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Users.findByIdAndDelete(req.params.userId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = userRouter;