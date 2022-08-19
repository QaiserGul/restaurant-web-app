const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Promotions = require('../models/promotions');
let authenticate = require('../authenticate');

const promotionsRoute = express.Router();

promotionsRoute.use(bodyParser.json());

promotionsRoute.route('/')
.get((req,res,next) => {
    Promotions.find({})
    .then((Promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(Promotions);
    },(err) => next(err))
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req,res,next) => {
    Promotions.create(req.body)
    .then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(result);
    },(err) => next(err))
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end(`Operation not allowed. Cant update data related to /Promotions`);
})
.delete(authenticate.verifyUser, (req,res,next) => {
    Promotions.remove({})
    .then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(result);
    },(err) => next(err))
    .catch(err => next(err));
});

promotionsRoute.route('/:promotionId')
.get((req,res,next) => {
    Promotions.findById(req.params.promotionId)
    .then((Promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(Promotions);
    },(err) => next(err))
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end(`POST request is not supported`);
})
.put(authenticate.verifyUser, (req,res,next) => {
    Promotions.findByIdAndUpdate(req.params.promotionId,{
        $set: req.body
    },{new:true})
    .then((Promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(Promotions);
    },(err) => next(err))
    .catch(err => next(err));
})
.delete(authenticate.verifyUser, (req,res,next) => {
    Promotions.findByIdAndRemove(req.params.promotionId)
    .then((Promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(Promotions);
    },(err) => next(err))
    .catch(err => next(err));
});

module.exports = promotionsRoute;