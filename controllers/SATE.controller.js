var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config/config.json');

router.get('/', function (req, res) {
    res.render('SATE', {});
});

module.exports = router;