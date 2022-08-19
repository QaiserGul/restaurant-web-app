const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
let authenticate = require('../authenticate');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.get((req,res,next) => {
    Dishes.find({})
    .populate('comments.author')
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    },(err) => next(err))
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req,res,next) => {
    Dishes.create(req.body)
    .then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(result);
    },(err) => next(err))
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end(`Operation not allowed. Cant update data related to /dishes`);
})
.delete(authenticate.verifyUser, (req,res,next) => {
    Dishes.remove({})
    .then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(result);
    },(err) => next(err))
    .catch(err => next(err));
});

dishRouter.route('/:dishId')
.get(authenticate.verifyUser, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    },(err) => next(err))
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end(`POST request is not supported`);
})
.put(authenticate.verifyUser, (req,res,next) => {
    Dishes.findByIdAndUpdate(req.params.dishId,{
        $set: req.body
    },{new:true})
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    },(err) => next(err))
    .catch(err => next(err));
})
.delete(authenticate.verifyUser, (req,res,next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    },(err) => next(err))
    .catch(err => next(err));
});

dishRouter.route('/:dishId/comments')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if(dish) {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments);
        } else {
            res.statusCode = 404;
            err = new Error('Dish not found!');
            return next(err);
        }
    },(err) => next(err))
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish) {
            req.body.author = dish._id;
            dish.comments.push(req.body);
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish);
                })
            },(err) => next(err));
        } else {
            res.statusCode = 404;
            err = new Error('Dish not found!');
            return next(err);
        }
    },(err) => next(err))
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end(`Operation not allowed. Cant update data related to ${req.params.dishId}`);
})
.delete(authenticate.verifyUser, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish) {
            // dish.comments = [];
            for(let i=dish.comments.length-1; i>=0; i--) {
                dish.comments[0].remove();
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            }, (err) => next(err));
        } else {
            res.statusCode = 404;
            err = new Error('Dish not found!');
            return next(err);
        }
    },(err) => next(err))
    .catch(err => next(err));
});

dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if(dish && dish.comments.id(req.params.commentId) ) {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments.id(req.params.commentId));
        } else if (!dish){
            res.statusCode = 404;
            err = new Error(`Dish ${req.params.dishId} not found`);
            return next(err);
        }else {
            res.statusCode = 404;
            err = new Error(`Comment ${req.params.commentId} not found`);
            return next(err);
        }
    },(err) => next(err))
    .catch(err => next(err));
})

.post(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end(`POST request is not supported`);
})
.put(authenticate.verifyUser, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        const com = dish.comments.id(req.params.commentId);
        if(dish && com ) {
            if(req.body.rating) {
                com.rating = req.body.rating;
            } 
            if(req.body.comment) {
                com.comment = req.body.comment;
            }
            dish.save()
            .then((dish) => {
                Dish.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(com);
                })
            }, (err) => next(err));
        } else if (!dish){
            res.statusCode = 404;
            err = new Error(`Dish ${req.params.dishId} not found`);
            return next(err);
        }else {
            res.statusCode = 404;
            err = new Error(`Comment ${req.params.commentId} not found`);
            return next(err);
        }
    },(err) => next(err))
    .catch(err => next(err));
})

.delete(authenticate.verifyUser, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish && dish.comments.id(req.params.commentId) ) {
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish) => {
                Dish.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(com);
                })
            }, (err) => next(err));
        } else if (!dish){
            res.statusCode = 404;
            err = new Error(`Dish ${req.params.dishId} not found`);
            return next(err);
        }else {
            res.statusCode = 404;
            err = new Error(`Comment ${req.params.commentId} not found`);
            return next(err);
        }
    },(err) => next(err))
    .catch(err => next(err));
})


module.exports = dishRouter;