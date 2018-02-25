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

function twitFunction(cmdLine, twitArg){
    client.get('search/tweets/', {from: twitArg, count: 20}, function(error, tweets, response){
        if (error){
            console.log("Error occurred: " + error);
            return;
        };
        var tweetData = "";
        tweets.statuses.forEach(function(item){
            var tweetTime = moment(item.created_at, 'ddd MMM DD HH:mm:ss ZZ YYYY').format('lll');
            var tweetText = item.text;
            tweetData += tweetTime + ":\r" + tweetText + "\r\r";
            console.log("\n" + chalk.bold(tweetTime + ":"));
            console.log(tweetText);
        });
        addLog(cmdLine, twitArg, tweetData);
    });
};

function sngFunction(cmdLine, sngArg){
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
        var artistList = "";
        sngInfo.artists.forEach(function(item, key){
            console.log(item.name);
            if (key === 0){
                artistList += item.name;
            } else {
                artistList += ", " + item.name;
            };
        });
        console.log("\n" + chalk.bold("Preview:"));
        console.log(sngInfo.preview_url);
        var sngData = "Song:\r" + sngInfo.name + "\r\rAlbum:\r" + sngInfo.album.name + "\r\rArtist(s):\r" + artistList + "\r\rPreview:\r" + sngInfo.preview_url + "\r\r";
        addLog(cmdLine, sngArg, sngData);
    });
};

function movFunction(cmdLine, movArg){
    var mov = movArg.replace(/\s+/g, "+");
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
        var rtRating = "";
        if (movInfo.Ratings[1]){
            rtRating = movInfo.Ratings[1].Value;
        } else {
            rtRating = "N/A";
        };
        console.log(rtRating);
        console.log("\n" + chalk.bold("Produced In:"));
        console.log(movInfo.Country);
        console.log("\n" + chalk.bold("Language:"));
        console.log(movInfo.Language);
        console.log("\n" + chalk.bold("Plot:"));
        console.log(movInfo.Plot);
        console.log("\n" + chalk.bold("Actors:"));
        console.log(movInfo.Actors);
        var movData = "Title:\r" + movInfo.Title + "\r\rRelease Date:\r" + movInfo.Released + "\r\rIMDB Rating:\r" + movInfo.Ratings[0].Value + "\r\rRotten Tomatoes Rating:\r" + rtRating + "\r\rProduced In:\r" + movInfo.Country + "\r\rLanguage:\r" + movInfo.Language + "\r\rPlot:\r" + movInfo.Plot + "\r\rActors:\r" + movInfo.Actors + "\r\r";
        addLog(cmdLine, movArg, movData);
    });
};

function addRandom(sve, cmd, arg){
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            console.log("Error occurred: " + error);
            return;
        };
        var dataArr = data.split("\r\n");
        var addLine = cmd + ',"' + arg + '"';
        if (sve === true && dataArr.indexOf(addLine) === -1){
            fs.appendFile("random.txt", '\r' + addLine, function(error) {
                if (error) {
                    console.log("Error occurred: " + error);
                    return;
                };
            });
        };
    });
};

function addLog(cmd, arg, info){
    var head = moment().format('lll') + ': ' + cmd + ' "' + arg + '"';
    fs.appendFile("log.txt", "~-~-~-~-~-~-~-~-~-~\r### " + head + "\r\r" + info + "~-~-~-~-~-~-~-~-~-~\r", function(error) {
        if (error) {
            console.log("Error occurred: " + error);
            return;
        };
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
        },
        {
            type: "confirm",
            message: "Do you want to add this command to the do-what-it-says random file?",
            name: "add",
            default: false,
            when: function(cmd){
                return cmd.command === "20-tweets" || cmd.command === "spotify-this-song" || cmd.command === "movie-this"
            }
        }
    ])
    .then(function(inqResponse){
        switch(inqResponse.command){
            case "20-tweets":
                var acnt = inqResponse.account.trim().toLowerCase();
                if (acnt === ""){
                    acnt = acntDefault;
                };
                addRandom(inqResponse.add, inqResponse.command, acnt);
                twitFunction(inqResponse.command, acnt);
                break;
            case "spotify-this-song":
                var sng = inqResponse.song.trim().toLowerCase();
                if (sng === ""){
                    sng = sngDefault;
                };
                addRandom(inqResponse.add, inqResponse.command, sng);
                sngFunction(inqResponse.command, sng);
                break;
            case "movie-this":
                var movie = inqResponse.movie.trim().toLowerCase();
                if (movie === ""){
                    movie = movieDefault;
                };
                addRandom(inqResponse.add, inqResponse.command, movie);
                movFunction(inqResponse.command, movie);
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
                    var dwitsCmd = inqResponse.command + " ---> " + itemArr[0];
                    var stripQuotes = itemArr[1].replace(/"+/g, "");
                    switch(itemArr[0]){
                        case "20-tweets":
                            twitFunction(dwitsCmd, stripQuotes);
                            break;
                        case "spotify-this-song":
                            sngFunction(dwitsCmd, stripQuotes);
                            break;
                        case "movie-this":
                            movFunction(dwitsCmd, stripQuotes);
                    }
                });
        }
    });