require('dotenv').config();

var keys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var inquirer = require('inquirer');
var moment = require('moment');
var chalk = require('chalk');
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var acntDefault = "NASA";
var sngDefault = "The Sign";
var movieDefault = "Mr. Nobody";

function twitFunction(twitArg){
    client.get('search/tweets/', {from: twitArg, count: 20}, function(error, tweets, response){
        if (error){
            console.log("Error occurred: " + error);
            return;
        };
        tweets.statuses.forEach(function(item){
            var tweetTime = moment(item.created_at, 'ddd MMM DD HH:mm:ss ZZ YYYY').format('lll');
            var tweetText = item.text;
            console.log("\n" + chalk.bold(tweetTime + ":"));
            console.log(tweetText);
        })
    });
};

function sngFunction(sngArg){
    spotify.search({type: 'track', query: '"' + sngArg + '"', limit: 1}, function(error, data){
        if (error){
            console.log("Error occurred: " + error);
            return;
        };
        var sngInfo = data.tracks.items[0];
        console.log("\n" + chalk.bold("Song:"));
        console.log(sngInfo.name);
        console.log("\n" + chalk.bold("Album:"));
        console.log(sngInfo.album.name);
        console.log("\n" + chalk.bold("Artist(s):"));
        sngInfo.artists.forEach(function(item){
            console.log(item.name);
        });
        console.log("\n" + chalk.bold("Preview:"));
        console.log(sngInfo.preview_url);
    });
};

function movFunction(movArg){
    var mov = movArg.replace(/\s/g, "+");
    var omdbQueryUrl = "http://www.omdbapi.com/?t=" + mov + "&y=&plot=short&apikey=trilogy";
    request(omdbQueryUrl, function(error, response, body) {
        if (error) {
            console.log("Error occurred: " + error);
            return;
        };
        var movInfo = JSON.parse(body);
        console.log("\n" + chalk.bold("Title:"));
        console.log(movInfo.Title)
        console.log("\n" + chalk.bold("Release Date:"));
        console.log(movInfo.Released);
        console.log("\n" + chalk.bold("IMDB Rating:"));
        console.log(movInfo.Ratings[0].Value);
        console.log("\n" + chalk.bold("Rotten Tomatoes Rating:"));
        console.log(movInfo.Ratings[1].Value);
        console.log("\n" + chalk.bold("Produced In:"));
        console.log(movInfo.Country);
        console.log("\n" + chalk.bold("Language:"));
        console.log(movInfo.Language);
        console.log("\n" + chalk.bold("Plot:"));
        console.log(movInfo.Plot);
        console.log("\n" + chalk.bold("Actors:"));
        console.log(movInfo.Actors);
    });
};

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
            default: acntDefault,
            when: function(cmd){
                return cmd.command === "20-tweets";
            }
        },
        {
            type: "input",
            message: "Which song are you interested in?",
            name: "song",
            default: sngDefault,
            when: function(cmd){
                return cmd.command === "spotify-this-song"
            }
        },
        {
            type: "input",
            message: "Which movie are you interested in?",
            name: "movie",
            default: movieDefault,
            when: function(cmd){
                return cmd.command === "movie-this"
            }
        }
    ])
    .then(function(inqResponse){
        switch(inqResponse.command){
            case "20-tweets":
                var acnt = inqResponse.account.trim();
                if (acnt === ""){
                    acnt = acntDefault;
                };
                twitFunction(acnt);
                break;
            case "spotify-this-song":
                var sng = inqResponse.song.trim();
                if (sng === ""){
                    sng = sngDefault;
                };
                sngFunction(sng);
                break;
            case "movie-this":
                var movie = inqResponse.movie.trim();
                if (movie === ""){
                    movie = movieDefault;
                };
                movFunction(movie);
                break;
            case "do-what-it-says":
                fs.readFile("random.txt", "utf8", function(error, data) {
                    if (error) {
                        console.log("Error occurred: " + error);
                        return;
                    }
                    var dataArr = data.split("\r\n");
                    var index = Math.floor(Math.random() * dataArr.length)
                    var itemArr = dataArr[index].split(",");
                    switch(itemArr[0]){
                        case "20-tweets":
                            twitFunction(itemArr[1]);
                            break;
                        case "spotify-this-song":
                            sngFunction(itemArr[1]);
                            break;
                        case "movie-this":
                            movFunction(itemArr[1]);
                    }
                });
        }
    });