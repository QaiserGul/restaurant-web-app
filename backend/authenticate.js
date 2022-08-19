 let passport = require('passport');
 let localStrategy = require('passport-local').Strategy;
 let User = require('./models/user');
 let JwtStrategy = require('passport-jwt').Strategy;
 let ExtractJwt = require('passport-jwt').ExtractJwt;
 let jwt = require('jsonwebtoken');

 var config = require('./config');

 exports.local = passport.use(new localStrategy(User.authenticate()));
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());

 exports.getToken = (user) => {
     return jwt.sign(user, config.secretKey, {expiresIn: 3600});
 }

 let opts = {};
 opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
 opts.secretOrKey = config.secretKey;

 exports.jwtPassport = passport.use(new JwtStrategy(opts,(jwt_payload,done) => {
     console.log("jwt payload", jwt_payload);
     User.findOne({_id: jwt_payload._id},(err, user) => {
         if(err) {
             return done(err, false);
         } else if(user) {
             return done(null,user);
         } else {
             return done(null, false);
         }
     })
 }))

 exports.verifyUser = passport.authenticate('jwt',{session: false});