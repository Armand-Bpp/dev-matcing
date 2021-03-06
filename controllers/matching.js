var express = require('express');
var router = express.Router(); // same as those 2 lines: var router = require('express').Router();

const userModel = require('../models').user
const offerModel = require('../models/offer');
const calculateScore = require('../matching/calculateScore')

const matchingModel = require('../models').matching;

// router.post('/', function (req, res) {
//     console.log('POST /favorites');
//     console.log('POST /favorites req.body', req.body);
//     console.log('POST /favorites req.query', req.query);
//     console.log('POST /favorites req.params', req.params);

//     const query = {
//         userId: req.body.userId,
//         typeId: req.body.typeId,
//         offerId: req.body.offerId,
//         devId: req.body.devId,
//         data: req.body.data
//     }


//     var matches = new matchingModel(query);
//     matches.save(function (err, matchdb) {
//         if (err !== null) {
//             console.log('favorite save err', err);
//             res.json({
//                 success: false,
//                 message: err.toString()
//             });
//             return;
//         }
//         res.json({
//             success: true,
//             data: matchdb
//         });
//     });
// });

router.get('/', function (req, res) {
    console.log('GET /matching');
    console.log('GET /matching req.body', req.body);
    console.log('GET /matching req.query', req.query);
    console.log('GET /matching req.params', req.params);
                                                                                                                                                                                                                    

    matchingModel
    .find({})
    // .populate('data')
        // .limit(limit)
        .exec(function (err, matches) {
            console.log('GET /matching err', err);
            console.log('GET /matching matching', matches);
            if (err !== null) {
                console.log('Error db find err:', err);
                res.json({
                    success: false,
                    message: err.toString()
                });
                return;
            }
            res.json({
                success: true,
                data: matches
            });
        });

    });

// });

// router.get('/offers/:userid', function(req, res){
//     console.log('GET /users/:id');
//     console.log('GET /users/:id req.body', req.body);
//     console.log('GET /users/:id req.query', req.query);
//     console.log('GET /users/:id req.params', req.params);

    
//     offerModel
//     .find({})
//     .populate('skills')
//     .exec(function(err,offer){
//         console.log('user',offer)
//         if (err !== null){
//             res.json({
//                 success: false,
//                 message: err.toString()
//             });
//             return;
//         }
//     res.json({
//         success: true,
//         data: offer
//     });
// })
// })

router.get('/users/:id', function(req, res){
    console.log('GET /users/:id');
    console.log('GET /users/:id req.body', req.body);
    console.log('GET /users/:id req.query', req.query);
    console.log('GET /users/:id req.params', req.params);

    
    userModel
    .findById(req.params.id)
    .populate('skills')
    .exec(function(err,user){
        console.log('user',user)
        if (err !== null){
            res.json({
                success: false,
                message: err.toString()
            });
            return;
        }
        offerModel
        .find({})
        .populate('skills')
        .exec(function(err,offers){
            console.log('user',offers)
            if (err !== null){
                res.json({
                    success: false,
                    message: err.toString()
                });
                return;
            }
            // calculateScore(offer, user)
            var scores = offers.map((offer)=>{
                const score = calculateScore(offer,user);
                return {
                    matchId:"user",
                    matchData: req.params.id,
                    data: offer._id,
                    score:score,
                    typeId:"offer"
                }
            })
            console.log(scores,'scores');
            
            // console.log(calculate,'calculate')
            matchingModel.create(scores, function(err, scoredb){
                if (err !== null) {
                    console.log('favorite save err', err);
                    res.json({
                        success: false,
                        message: err.toString()
                    });
                    return;
                }
        
            })
            
            res.json({
                success: true,
                data: offers,
                user,
            });
            
        })
    })
    
})

// router.get('/users/:id', function (req, res) {
//     console.log('GET /matching/:id');
//     console.log('GET /matching/:id req.body', req.body);
//     console.log('GET /matching/:id req.query', req.query);
//     console.log('GET /matching/:id req.params', req.params);
//     // console.log(query.data,'data');
    
//     // const query = {
//     //     userId: req.body.userId,
//     //     typeId: req.body.typeId,
//     //     offerId: req.body.offerId,
//     //     devId: req.body.devId,
//     //     data: req.body.data
//     // }
//     // console.log(userId,'userid');
//     // console.log(query.data,'querydata');
    

    

//     // if (query.typeId === "user"){
//     userModel
//         .find({})
//         .populate('data')
//             // .limit(limit)
//             .exec(function (err, matches) {
//                 console.log('GET /matches err', err);
//                 console.log('GET /matches matches', matches);
//                 if (err !== null) {
//                     console.log('Error db find err:', err);
//                     res.json({
//                         success: false,
//                         message: err.toString()
//                     });
//                     return;
//                 }
//                 res.json({
//                     success: true,
//                     data: matches || []
//                 });
//             });

//     // } else if (query.typeId === "offer"){

//     });


module.exports = router;