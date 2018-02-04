var config = require('config/config.json');
var db = require('config/db.js');
var moment = require('moment');
var placesService = require('services/places.service');
var placesInst = new placesService;
var geodist = require('geodist')

//Initialize collections for nodes and logs
const foodWords = db.monk().get('foodwords')
 
//Object containing all service functions called externally 
var service = {};
service.getAllWords = getAllSorted;
service.insertFoodWords = insertFoodWords;
service.insertFoodWord = insertFoodWord; //Single word test route
service.clearAll = clearAll;
service.conversation = conversation;
service.train = train;

//export all methods needed externally 
module.exports = service;

//Returns all food words
function getAllWords(){
    return foodWords.find({});
}

function getAllSorted(){
    return foodWords.find({}, {sort:{ count: -1 }});
}

//Returns specific word if exists
function getWord(){
    return foodWords.findOne({});
}

//Inserts every food word in the foodwords array
function insertFoodWords(foodArray, location, radius){
    var promises = [];
    foodArray.forEach(function(foodword) {
        promises.push(placesInst.getRestaurants(location, radius, foodword).then(function(restos){
            var results = []
            restos.results.forEach(function(resto) {
                var result = {}
                result.name = resto.name;
                result.location = resto.formatted_address;
                result.rating = resto.rating;
                result.keyword = foodword;
                result.distance = geodist(location, resto.geometry.location, {unit: 'meters'});
                result.lat = resto.geometry.location.lat;
                result.lng = resto.geometry.location.lng;
                if(resto.opening_hours){
                    result.open = "closed"
                    if(resto.opening_hours.open_now){
                        result.open = "open"
                    }
                } else{
                    result.open = "unknown"
                }
                console.log(result);
                results.push(result);
            }, this);
            return results;

        }));
        insertFoodWord(foodword);
    }, this);
    return Promise.all(promises)
}

//Inserts food words individually into the foodwords collection
function insertFoodWord(foodWord){
    foodWord = foodWord.toLowerCase();
    return foodWords.update({food: foodWord}, {
        $inc: {count: 1}, 
        $set: {food: foodWord}
    }, {upsert: true})
}

//Clears db
function clearAll(){
    //return foodWords.remove({});
    return foodWords.createIndex( { food: "text" } )
}

function conversation(convo, location, radius){
    return pullFoodWords(convo).then(function(pulledconvo){
        return insertFoodWords(pulledconvo, location, radius);
    });
}

function pullFoodWords(convo){
    return foodWords.find( { $text: { $search: convo } } ).then(function(pulledWords){
        return pulledWords.map(x => x.food);
    })
}

function train(trainList){
    trainList = trainList.split(".");
    trainList.forEach(function(foodword) {
        insertFoodWord(foodword.trim());
    });
    return Promise.resolve();
}