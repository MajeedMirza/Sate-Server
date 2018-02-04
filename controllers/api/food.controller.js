var config = require('config/config.json');
var express = require('express');
var router = express.Router();
var foodService = require('services/food.service');
var voiceService = require('services/voice.service');

// routes
router.post('/insert', insertfoodWords);
router.get('/getAll', getAll);
router.get('/insertWord/:word', insertfoodWord)
router.get('/clearAll', clearAll);
router.post('/textConversation', textConversation);
router.get('/conversation', conversation);


module.exports = router;

function insertfoodWords(req, res) {
    console.log("Inserting values from string: " + req.body.foodWords);
    foodService.insertFoodWords(req.body.foodWords,req.body.location,req.body.radius)
        .then(function(results) {
            res.send([].concat.apply([], results));
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    foodService.getAllWords()
        .then(function (foodWords) {
            res.send(foodWords);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function clearAll(req, res) {
    foodService.clearAll()
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function insertWord(req, res) {
    foodService.getAllWords()
        .then(function (foodWords) {
            res.send(foodWords);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function insertfoodWord(req, res) {
    var word = req.params.word;
    console.log("Inserting word: " + word)
    foodService.insertFoodWord(word)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function textConversation(req, res) {
    console.log("Retrieving results for conversation: " + req.body.conversation);
    foodService.conversation(req.body.conversation, req.body.location, req.body.radius)
        .then(function(results) {
            res.send([].concat.apply([], results));
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function conversation(req, res) {
    voiceService.sendAudio().then(function(result){
        var text = result.results[0].alternatives[0].transcript;
        console.log(text);
        return text;
    }).then(function(convo){
    var location = {
		"lat":"45.5017156", 
		"lng":"-73.5728669"
	}
    var radius = 500;
    foodService.conversation(convo, location, radius)
        .then(function(results) {
            res.send([].concat.apply([], results));
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
    })
    
}