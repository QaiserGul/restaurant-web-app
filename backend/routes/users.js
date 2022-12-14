var express = require('express');
let User = require('../models/user');
let bodyParser = require('body-parser');
let passport = require('passport');
let authenticate = require('../authenticate');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res) => {
  User.register(new User({username: req.body.username}), req.body.password, (err,user) => {
      //res.json(req.body);
    if(err) {
      console.log(err);
      res.statusCode = 500;
      res.setHeader('Content-Type','application/json');
      res.json({err:err});
    } else {
        if(req.body.firstname) {
          user.firstname = req.body.firstname;
        }
        if(req.body.lastname) {
          user.lastname = req.body.lastname;
        }
        user.save((err, user) => {
          if(err) {
            res.statusCode = 500;
            res.setHeader('Content-Type','application/json');
            res.json({err:err});
          } else {
            passport.authenticate('local')(req,res, () =>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({success:true, status: 'Registration Successful'});
          });
          }
        });    
    }
  }) 
});

module.exports = router;

router.post('/login',passport.authenticate('local'), (req, res) => {
  let token = authenticate.getToken({_id:req.user._id});

  res.statusCode = 200;
  res.setHeader('Content-Type','application/json');
  res.json({success:true, token:token, status: 'Registration Successful'});
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