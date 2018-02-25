// include the various node modules
require('dotenv').config();
var keys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var inquirer = require('inquirer');
var moment = require('moment');
var chalk = require('chalk');
var fs = require("fs");

// activate the keys 
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var omdbKey = keys.omdb.id;

// set the default values for the different functions
var acntDefault = "NASA";
var sngDefault = "The Sign";
var movieDefault = "Mr. Nobody";

// function to get and post the twitter results
function twitFunction(cmdLine, twitArg){
    // makes the request to twitter for the most recent 20 tweets from the account requested (twitArg)
    client.get('search/tweets/', {from: twitArg, count: 20}, function(error, tweets, response){
        if (error){
            console.log("Error occurred: " + error);
            return;
        };
        // variable to hold all the tweet data to be stored in the log file
        var tweetData = "";
        // checks to see if the twitter account is found
        if (tweets.statuses.length === 0){
            console.log("\nI could not find that account! Please try again.")
            addLog(cmdLine, twitArg, "Account not found.\r\r");
        } else {
            // loops through the array returned from twitter
            tweets.statuses.forEach(function(item){
                // formats the time the tweet was posted
                var tweetTime = moment(item.created_at, 'ddd MMM DD HH:mm:ss ZZ YYYY').format('lll');
                // variable to hold the tweet
                var tweetText = item.text;
                // builds the variable storing all the tweet data
                tweetData += tweetTime + ":\r" + tweetText + "\r\r";
                // posts the tweet data with some formating
                console.log("\n" + chalk.bold(tweetTime + ":"));
                console.log(tweetText);
            });
            // calls the function that appends the data to the log.txt file
            addLog(cmdLine, twitArg, tweetData);
        }
    });
};

// function to get and post the spotify results
function sngFunction(cmdLine, sngArg){
    // makes the request to spotify for the specific song requested (sngArg)
    spotify.search({type: 'track', query: '"' + sngArg + '"', limit: 1}, function(error, data){
        if (error){
            console.log("Error occurred: " + error);
            return;
        };
        var sngInfo = data.tracks.items[0];
        // checks to see if the song is found
        if (sngInfo === undefined){
            console.log("\nI could not find that song! Please try again.");
            addLog(cmdLine, sngArg, "Song not found.\r\r");
        } else {
            // posts the song data with some formating
            console.log("\n" + chalk.bold("Song:"));
            console.log(sngInfo.name);
            console.log("\n" + chalk.bold("Album:"));
            console.log(sngInfo.album.name);
            console.log("\n" + chalk.bold("Artist(s):"));
            var artistList = "";
            // loops through the artists array returned from spotify
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
            // builds the variable storing all the song data
            var sngData = "Song:\r" + sngInfo.name + "\r\rAlbum:\r" + sngInfo.album.name + "\r\rArtist(s):\r" + artistList + "\r\rPreview:\r" + sngInfo.preview_url + "\r\r";
            // calls the function that appends the data to the log.txt file
            addLog(cmdLine, sngArg, sngData);
        };
    });
};

// function to get and post the OMDB results
function movFunction(cmdLine, movArg){
    // strips the punctuation from the movie title and replaces spaces with "+"
    var mov = movArg.replace(/\s+/g, "+").replace(/[,$~%.:*?]+/g,"");
    // builds the URL for the OMDB API
    var omdbQueryUrl = "http://www.omdbapi.com/?t=" + mov + "&y=&plot=short&apikey=" + omdbKey;
    // makes the request to OMDB for the specific movie requested (movArg)
    request(omdbQueryUrl, function(error, response, body) {
        if (error) {
            console.log("Error occurred: " + error);
            return;
        };
        var movInfo = JSON.parse(body);
        // checks to see if the movie is found
        if (movInfo.Error) {
            console.log("\nI could not find that movie! Please try again.");
            addLog(cmdLine, movArg, "Movie not found.\r\r");
        } else {
            // posts the movie data with some formating
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
            // builds the variable storing all the movie data
            var movData = "Title:\r" + movInfo.Title + "\r\rRelease Date:\r" + movInfo.Released + "\r\rIMDB Rating:\r" + movInfo.Ratings[0].Value + "\r\rRotten Tomatoes Rating:\r" + rtRating + "\r\rProduced In:\r" + movInfo.Country + "\r\rLanguage:\r" + movInfo.Language + "\r\rPlot:\r" + movInfo.Plot + "\r\rActors:\r" + movInfo.Actors + "\r\r";
            // calls the function that appends the data to the log.txt file
            addLog(cmdLine, movArg, movData);
        };
    });
};

// function for adding a request to the random.txt file used by the do-what-it-says command
function addRandom(sve, cmd, arg){
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            console.log("Error occurred: " + error);
            return;
        };
        // puts the data in the random.txt file into an array
        var dataArr = data.split("\r\n");
        // creates a variable and stores the request command and value
        var addLine = cmd + ',"' + arg + '"';
        // checks to make sure the information should be stored and that the current request is not already in the file
        if (sve === true && dataArr.indexOf(addLine) === -1){
            // stores the current request in the random.txt file
            fs.appendFile("random.txt", '\r' + addLine, function(error) {
                if (error) {
                    console.log("Error occurred: " + error);
                    return;
                };
            });
        };
    });
};

// function to store the returned data in the log.txt file
function addLog(cmd, arg, info){
    // builds the header (time the request was made and the request)
    var head = moment().format('lll') + ': ' + cmd + ' "' + arg + '"';
    // appends the header and data to the log.txt file
    fs.appendFile("log.txt", "~-~-~-~-~-~-~-~-~-~\r### " + head + "\r\r" + info + "~-~-~-~-~-~-~-~-~-~\r", function(error) {
        if (error) {
            console.log("Error occurred: " + error);
            return;
        };
    });
};

// uses the inquirer node module to prompt the user for information
inquirer
    .prompt([
        {
            // question to select the function to be run
            type: "list",
            message: "Which function do you want to use? (use arrow keys and enter to select)",
            choices: ["20-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
            name: "command"
        },
        {
            // asks for the account from which to retrieve tweets - will only be asked if the 20-tweets function is selected
            type: "input",
            message: "From which account do you want to retrieve tweets?",
            name: "account",
            default: acntDefault,
            when: function(cmd){
                return cmd.command === "20-tweets";
            }
        },
        {
            // asks for the song to get information for - will only be asked if the spotify-this-song function is selected
            type: "input",
            message: "Which song are you interested in?",
            name: "song",
            default: sngDefault,
            when: function(cmd){
                return cmd.command === "spotify-this-song"
            }
        },
        {
            // asks for the movie to get information for - will only be asked if the movie-this function is selected
            type: "input",
            message: "Which movie are you interested in?",
            name: "movie",
            default: movieDefault,
            when: function(cmd){
                return cmd.command === "movie-this"
            }
        },
        {
            // asks to store the request in the random.txt file for future use by the do-what-it-says function - will only be asked if one of the first three functions is selected
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
                // normalizes the response for the twitter account requested
                var acnt = inqResponse.account.trim().toLowerCase();
                if (acnt === ""){
                    acnt = acntDefault;
                };
                // calls function to store the current request in the random.txt file
                addRandom(inqResponse.add, inqResponse.command, acnt);
                // calls function to get the tweets requested
                twitFunction(inqResponse.command, acnt);
                break;
            case "spotify-this-song":
                // normalizes the response for the song requested
                var sng = inqResponse.song.trim().toLowerCase();
                if (sng === ""){
                    sng = sngDefault;
                };
                // calls function to store the current request in the random.txt file
                addRandom(inqResponse.add, inqResponse.command, sng);
                // calls function to get the information for the song requested
                sngFunction(inqResponse.command, sng);
                break;
            case "movie-this":
                // normalizes the response for the song requested
                var movie = inqResponse.movie.trim().toLowerCase();
                if (movie === ""){
                    movie = movieDefault;
                };
                // calls function to store the current request in the random.txt file
                addRandom(inqResponse.add, inqResponse.command, movie);
                // calls function to get the information for the movie requested
                movFunction(inqResponse.command, movie);
                break;
            case "do-what-it-says":
                // reads the random.txt file
                fs.readFile("random.txt", "utf8", function(error, data) {
                    if (error) {
                        console.log("Error occurred: " + error);
                        return;
                    }
                    // creates an array containing each stored request
                    var dataArr = data.split("\r\n");
                    // generates a random number to select a request
                    var index = Math.floor(Math.random() * dataArr.length)
                    // creates an array containing the selected request and split into the command and value
                    var itemArr = dataArr[index].split(",");
                    // creates the command for display in the log.txt file
                    var dwitsCmd = inqResponse.command + " ---> " + itemArr[0];
                    // strips the quotation marks from around the request value
                    var stripQuotes = itemArr[1].replace(/"+/g, "");
                    switch(itemArr[0]){
                        case "20-tweets":
                            // call the twitter function if one of the 20-tweets requests is selected
                            twitFunction(dwitsCmd, stripQuotes);
                            break;
                        case "spotify-this-song":
                            // call the spotify function if one of the spotify-this-song requests is selected
                            sngFunction(dwitsCmd, stripQuotes);
                            break;
                        case "movie-this":
                            // call the OMDB function if one of the movie-this requests is selected
                            movFunction(dwitsCmd, stripQuotes);
                    }
                });
        }
    });