require('dotenv').config();

var keys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var inquirer = require('inquirer');
var moment = require('moment');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var acntDefault = "NASA";
var sngDefault = "The Sign";
var movieDefault = "Mr. Nobody";

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
                client.get('search/tweets/', {from: acct, count: 20}, function(error, tweets, response){
                    if (error){
                        console.log("Error occurred: " + error);
                        return;
                    };
                    tweets.statuses.forEach(function(item){
                        var tweetTime = moment(item.created_at, 'ddd MMM DD HH:mm:ss ZZ YYYY').format('lll');
                        var tweetText = item.text;
                        console.log("\n" + tweetTime + ":");
                        console.log(tweetText);
                    })
                });
                break;
            case "spotify-this-song":
                var sng = inqResponse.song.trim();
                if (sng === ""){
                    sng = sngDefault;
                };
                spotify.search({type: 'track', query: '"' + sng + '"', limit: 1}, function(error, data){
                    if (error){
                        console.log("Error occurred: " + error);
                        return;
                    };
                    var info = data.tracks.items[0];
                    console.log("\nSong:");
                    console.log(" " + info.name);
                    console.log("\nAlbum:");
                    console.log(" " + info.album.name);
                    console.log("\nArtist(s):");
                    info.artists.forEach(function(item){
                        console.log(" " + item.name);
                    });
                    console.log("\nPreview:");
                    console.log(" " + info.preview_url);
                });
                break;
            case "movie-this":
                var mov = inqResponse.movie.trim();
                if (mov === ""){
                    mov = movieDefault;
                };
                console.log("movie info under construction");
                break;
            case "do-what-it-says":
                console.log("do-what-it-says under construction");
        }
    });