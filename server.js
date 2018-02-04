﻿require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config/config.json');
var https = require('https');
var http = require('http');
var fs = require('fs');
var path = require('path');
var request = require('request');
var cors = require('cors');
var io = require('config/socket')

config.port = "3001";
config.Ip = "localhost"
config.portUrl = "http://" + config.Ip + ":" + config.port;
config.apiUrl = config.portUrl + "/api"

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));
app.use(cors());

// routes
app.use('/SATE', require('./controllers/SATE.controller'));
app.use('/api/food', require('./controllers/api/food.controller'));

// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/SATE');
});


//var server = app.listen(config.port, config.Ip, function () {
var server = app.listen(process.env.PORT || '3001', function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});


   