var db = require("../models");
var express = require('express');

var yelp = require('yelp-fusion');
var yelpClient = yelp.client('goV2fJN1bsvrbS3Kks8RTfWmyn7rGA1UnembUsKhboPqWkV6HaO0ffrUxOEnEKHOwXxhnO6tobM1Y73_OhE2cpGdshq2K9IxWEQm90H4VX8UzGMeqSjT5ABMLmtKXHYx');

var googleplacesapi = require('googleplacesapi');

const bcrypt = require('bcrypt');
const saltRounds = 10;

var router = express.Router();

router.post('/api/search/', function (req, res) {
    var searchTerm = req.body.searchTerm;
    var location = req.body.location.toString();
    var allData = {};

    // Yelp:
    yelpClient.search({
        term: searchTerm,
        location: location
    }).then(function (response) {
        var allYelpData = response.jsonBody.businesses;
        allYelpData = allYelpData.sort(function (a, b) {
            return b.rating - a.rating;
        });

        var yelpData = allYelpData[0];

        allData.yelpData = {
            id: yelpData.id,
            name: yelpData.name,
            image_url: yelpData.image_url,
            location: yelpData.location.address1 + ", " + yelpData.location.city + ", " + yelpData.location.zip_code,
            phone: yelpData.display_phone,
            rating: yelpData.rating,
            yelp_review_count: yelpData.review_count
        };

        //Google:
        var gpa = new googleplacesapi({
            key: 'AIzaSyDFTJ2SY-u5McOmAaic0i0l-kp_0oY95Po'
        });

        gpa.search({
            query: yelpData.name,
            location: location.toString()
        }, function (err, data) {
            if (!err) {
                if (data.results.length > 0) {
                    var googleData = data.results[0];

                    allData.googleData = {
                        id: googleData.id,
                        name: googleData.name,
                        rating: googleData.rating,
                        open: googleData.opening_hours.open_now,
                        price_range: googleData.price_level,
                        google_review_count: googleData.user_ratings_total
                    }

                    allData.trueReview = {
                        trueRating: ((allData.yelpData.rating + googleData.rating) / 2),
                        total_review_count: (allData.yelpData.yelp_review_count + googleData.user_ratings_total)
                    }
                } else {
                    allData.trueReview = {
                        trueRating: allData.yelpData.rating,
                        total_review_count: allData.yelpData.yelp_review_count
                    }
                }

                var axios = require('axios');
                var phoneNum = allData.yelpData.phone.toString().replace(/([\s-()])/g, '')

                axios.get('https://data.cityofnewyork.us/resource/9w7m-hzhe.json?phone=' + phoneNum)
                    .then(function (data) {
                        var foodRatingData = data.data.filter((data) => data.grade !== undefined)[0];
                        if (foodRatingData) {
                            allData.food_rating = {
                                grade: foodRatingData.grade
                            }
                        }
                        console.log(allData);
                        res.json(allData);
                    });
            } else {
                console.log(err);
            }
        });
    }).catch(function (e) {
        console.log(e);
    });
});

router.post("/api/favorites/", function (req, res) {

});

router.post("/api/signUp/", function (req, res) {

    var myPlaintextPassword = req.body.password;
    var unique;

    db.signUpInfo.count({
            where: {
                username: req.body.username
            }
        })
        .then(function (count) {
            if (count !== 0) {
                unique = false;
            } else {
                unique = true;
            };

            // console.log(unique);
            if (unique === true) {
                bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
                    console.log(hash);
                    db.signUpInfo.create({
                        username: req.body.username,
                        password: hash,
                    }).then(function (result) {
                        res.json(result);
                        console.log(result);
                    });
                });
            } else {
                res.json({
                    message: 'Username Is Already Taken',
                    success: false
                });
                console.log("Username Is Taken");
            }

        });
});

router.post("/api/login/", function (req, res) {
    console.log("Connected to API\n");

    var myPlaintextPassword = req.body.password;
    console.log(myPlaintextPassword);

    // resPass == true
    db.signUpInfo.findOne({
        where: {
            username: req.body.username,
        }
    }).then(function (user) {
        console.log(user);

        if (!user.validatePassword(myPlaintextPassword)) {
            console.log("Does not Work");
            return res.status(400).send("not working");
        } else {
            res.sendStatus(200).send("success");
            console.log("it works");
        }
    });
});


module.exports = router;