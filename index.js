const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require("mongoose")
const cors = require("cors")
const passport = require("passport")
const coockieParser = require("cookie-parser")
const session = require("express-session")
var FileStore = require('session-file-store')(session);
var authenticate = require('./authenticate');

mongoose.connect("mongodb+srv://morad:morad200105@cluster0.9wt8a.mongodb.net/basedb")
const app = express()

app.use(cors())
app.use(coockieParser("123456789"))
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//routes
const userRouter = require("./routes/users.js");
const handleUserRouter = require("./routes/handleUser.js") 

//coockie
// function auth (req, res, next) {

//     if (!req.signedCookies.user) {
//       var authHeader = req.headers.authorization;
//       if (!authHeader) {
//           var err = new Error('You are not authenticated!');
//           res.setHeader('WWW-Authenticate', 'Basic');              
//           err.status = 401;
//           next(err);
//           return;
//       }
//       var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//       var user = auth[0];
//       var pass = auth[1];
//       if (user == 'admin' && pass == 'password') {
//           res.cookie('user','admin',{signed: true});
//           next(); // authorized
//       } else {
//           var err = new Error('You are not authenticated!');
//           res.setHeader('WWW-Authenticate', 'Basic');              
//           err.status = 401;
//           next(err);
//       }
//     }
//     else {
//         if (req.signedCookies.user === 'admin') {
//             next();
//         }
//         else {
//             var err = new Error('You are not authenticated!');
//             err.status = 401;
//             next(err);
//         }
//     }
//   }



app.use(passport.initialize())


app.use("/user", userRouter)
app.use("/handle",handleUserRouter)

app.listen("8080")
