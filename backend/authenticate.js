 let passport = require('passport');
 let localStrategy = require('passport-local').Strategy;
 let User = require('./models/user');

 exports.local = passport.use(new localStrategy(User.authenticate()));
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());