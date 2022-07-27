const express = require('express')
const morgan = require('morgan')
const bodyparser = require('body-parser')
var cors = require('cors');
var jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose')
const routepath  = require('./Router/router')
const app = express()


mongoose.connect('mongodb://127.0.0.1:27017/crud_with_react')

app.use(cors());
app.use(express.static('uploads'));
app.use(morgan('tiny'))
app.use(bodyparser.json());       // to support JSON-encoded bodies
app.use(bodyparser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));

app.use("/", (req, res, next) => {
    try {
      if (req.path == "/login" || req.path == "/register" || req.path == "/") {
        next();
      } else {
        /* decode jwt token if authorized*/
        jwt.verify(req.headers.token, 'arslan', function (err, decoded) {
          if (decoded && decoded.user) {
            req.user = decoded;
            next();
          } else {
            return res.status(401).json({
              errorMessage: 'User unauthorized!',
              status: false
            });
          }
        })
      }
    } catch (e) {
      res.status(400).json({
        errorMessage: 'Something went wrong!',
        status: false
      });
    }
  })

app.use('/',routepath)




app.listen(2000,()=>{
    console.log("Server is Running on  port 2000")
})