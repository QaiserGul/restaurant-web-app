const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Leaders = require('../models/leaders');
let authenticate = require('../authenticate');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());
 
leaderRouter.route('/')
.get((req,res,next) => {
Leaders.find({})
    .then((Leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(Leaders
        );
    },(err) => next(err))
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req,res,next) => {
    Leaders.create(req.body)
    .then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(result);
    },(err) => next(err))
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end(`Operation not allowed. Cant update data related to /Leaders
`);
})
.delete(authenticate.verifyUser, (req,res,next) => {
    Leaders.remove({})
    .then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(result);
    },(err) => next(err))
    .catch(err => next(err));
});

leaderRouter.route('/:leaderId')
.get((req,res,next) => {
    Leaders.findById(req.params.leaderId)
    .then((Leaders
    ) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(Leaders
        );
    },(err) => next(err))
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end(`POST request is not supported`);
})
.put(authenticate.verifyUser, (req,res,next) => {
    Leaders
.findByIdAndUpdate(req.params.leaderId,{
        $set: req.body
    },{new:true})
    .then((Leaders
    ) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(Leaders
        );
    },(err) => next(err))
    .catch(err => next(err));
})
.delete(authenticate.verifyUser, (req,res,next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((Leaders
    ) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(Leaders
        );
    },(err) => next(err))
    .catch(err => next(err));
});

module.exports = leaderRouter;