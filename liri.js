require('dotenv').config();

var keys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var inquirer = require('inquirer');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);