# liri-node-app

### Overview

This is a node.js command line application that takes in user input and returns information based on that input.  The application also logs the request and information with the time the request was made in the log.txt file.

### Before you Begin

1. You will need to generate your own API keys.

2. Create a file named `.env`, add the following to it and replace the values with your API keys (no quotes) once you have them:

```js
# Spotify API keys

SPOTIFY_ID=your-spotify-id
SPOTIFY_SECRET=your-spotify-secret

# Twitter API keys

TWITTER_CONSUMER_KEY=your-twitter-consumer-key
TWITTER_CONSUMER_SECRET=your-twitter-consumer-secret
TWITTER_ACCESS_TOKEN_KEY=your-access-token-key
TWITTER_ACCESS_TOKEN_SECRET=your-twitter-access-token-secret

# OMDB API keys

OMDB_ID=your-omdb-api-key

```

3. Get Spotify API Keys

   * Step One: Visit <https://developer.spotify.com/>
   
   * Step Two: Click on `My Apps` and either login to your existing Spotify account or create a new one (a free account is fine) and log in.

   * Step Three: Once logged in, register a new application to be used with the Spotify API. You can fill in whatever you'd like for these fields. When finished, click the "complete" button.

   * Step Four: On the next screen, scroll down to where you see your client id (`your-spotify-id`) and client secret (`your-spotify-secret`). Copy these values and paste them as directed in item 2 above.

4. Get Twitter API Keys

   * Step One: Visit <https://apps.twitter.com/app/new>
   
   * Step Two: Fill out the form with dummy data. Type `http://google.com` in the Website input. Don't fill out the Callback URL input. Then submit the form.
   
   * Step Three: On the next screen, click the Keys and Access Tokens tab to get your consume key (`your-twitter-consumer-key`) and secret (`your-twitter-consumer-secret`). Copy these values and paste them as directed in step 2 above.
   
   * Step Four: At the bottom of the page, click the `Create my access token` button to get your access token key (`your-twitter-access-token-key`) and secret (`your-twitter-access-token-secret`). Copy these values and paste them as directed in item 2 above.

5. Get OMDB API Key

   * Step One: Visit <http://omdbapi.com/apikey.aspx>

   * Step Two: A free key should be fine. Fill out the form and click submit to obtain the API key (`your-omdb-api-key`). Copy this value and paste it as directed in item 2 above.

6. In the terminal command line, go to the directory where you installed the files and type `npm install` (no quotes).  This should install the required npm packages.

### Running the app

1. In the terminal command line, go to the directory where you installed the files and type `node liri.js` (no quotes).

That's It! The app will ask you questions to get the input it needs.