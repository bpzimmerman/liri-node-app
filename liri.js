require('dotenv').config();

var keys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var inquirer = require('inquirer');
var moment = require('moment');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

inquirer
    .prompt([
        {
            type: "list",
            message: "Which function do you want to use?",
            choices: ["20-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
            name: "command"
        },
        {
            type: "input",
            message: "From which account do you want to retrieve tweets?",
            name: "account",
            when: function(cmd){
                return cmd.command === "20-tweets";
            }
        },
        {
            type: "input",
            message: "Which song are you interested in?",
            name: "song",
            default: "The Sign",
            when: function(cmd){
                return cmd.command === "spotify-this-song"
            }
        },
        {
            type: "input",
            message: "Which movie are you interested in?",
            name: "movie",
            default: "Mr. Nobody",
            when: function(cmd){
                return cmd.command === "movie-this"
            }
        }
    ])
    .then(function(inqResponse){
        switch(inqResponse.command){
            case "20-tweets":
                client.get('search/tweets/', {from: inqResponse.account, count: 20}, function(error, tweets, response){
                    if (error){
                        console.log(error);
                    };
                    for (var i = 0; i < 20; i += 1){
                        var tweetTime = tweets.statuses[i].created_at;
                        tweetTime = moment(tweetTime, 'ddd MMM DD HH:mm:ss ZZ YYYY').format('lll');
                        var tweetText = tweets.statuses[i].text;
                        console.log("\n" + tweetTime + ":");
                        console.log(tweetText);
                    }
                });
                break;
            case "spotify-this-song":
                console.log("song info under construction");
                break;
            case "movie-this":
                console.log("movie info under construction");
                break;
            case "do-what-it-says":
                console.log("do-what-it-says under construction");
        }
    });