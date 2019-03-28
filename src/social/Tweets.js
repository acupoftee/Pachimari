require("dotenv").config();
const { Logger, JsonUtil, MessageUtil } = require('../utils');
const { PachimariClient } = require('../models');
const Queries = require('../db/Queries');
const Twitter = require('twitter');

class Tweets {
    /**
     * Instantiates a new Twitch object listening for OWL streams
     * @constructor
     * @param {PachimariClient} client a bot client
     */
    constructor(client) {
        this.client = client;
        this.twitterClient = new Twitter({
            consumer_key: process.env.TWITTER_KEY,
            consumer_secret: process.env.TWITTER_SECRET,
            access_token_key: process.env.TWITTER_TOKEN,
            access_token_secret: process.env.TWITTER_TOKEN_SECRET
        });
    }

    async watch() {
        setInterval(async() => {
            let params = {screen_name: "overwatchleague"};
            this.twitterClient.get('statuses/user_timeline', params, function(error, tweets, response) {
                if (!error) {
                  console.log(tweets[0].text);
                }
              });
        }, 5000);
    }
}
module.exports = Tweets;