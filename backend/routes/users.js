var express = require('express');
let User = require('../models/user');
let bodyParser = require('body-parser');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.findOne({userName: req.body.userName})
  .then((user) => {
    if(user) {
      let err = new Error(`User ${req.body.userName} already exists`);
      res.status = 403;
      return next(err);
    } else {
      User.create({
        userName: req.body.userName,
        password: req.body.password
      })
      .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({status: 'Registration Successful', user: user});
      })
      .catch(err => next(err));  
    }
  })
  .catch(err => next(err));
});

module.exports = router;

router.get('/login',(req, res, next) => {

  if(!req.session.user) {
    var authHeader = req.headers.authorization;
    if(!authHeader) {
      const err = new Error('You are not authenticated');
      
      res.setHeader('WWW-Authenticate', 'Basic')
      err.status = 401;
  
      next(err);
    }
  
    let auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');//split returns an array
    //Buffer is to convert base64 to string             Syntax of authHeader "Basic username:passoword"                                        
    let userName = auth[0];
    let password = auth[1];

    User.findOne({userName: username})
    .then((user) => {
      if(!user) {
        const err = new Error('User not registered. Please signup first');
        err.status = 403;
        return next(err);
      } else if(user.password !== password) {
        const err = new Error('Plese enter correct password');
        err.status = 403;
        return next(err);
      } else if (user.userName === username && user.password === password) {
        //res.cookie('user','admin', {signed : true});
        req.session.user = 'authenticated'; /// ***************
        res.statusCode = 200;
        res.setHeader('Content-Type','text/plain');
        res.end('You are authenticated'); 
      }
    })
    .catch(err => next(err))
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    res.end('You are already authenticated'); 
  }
});

router.get('/logout', (req, res, next) => {
  if(req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    const err = new Error('You are not logged in');
    res.statusCode = 403;
    next(err);
  }
})