const express = require('express');
const bodyParser = require('body-parser');
const Users = require("../models/user.js")
const userRouter = express.Router();
const passport = require('passport');
const authenticate = require('../authenticate');

userRouter.use(bodyParser.json());

userRouter.get('/',(req,res,next) => {
  res.send("good")
})

userRouter.post('/signup', (req, res, next) => {
  Users.register(new Users({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.body.type) {
        user.type = req.body.type
      }
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, user: user ,status: 'Registration Successful!'});
        });
      });
    }
  });
});
userRouter.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});
  
  userRouter.get('/logout', (req, res) => {
    if (req.session) {
      req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/user');
    }
    else {
      var err = new Error('You are not logged in!');
      err.status = 403;
      next(err);
    }
  });
module.exports = userRouter;