'use strict'
require('dotenv').config()
// const { Logger, JsonUtil, MessageUtil } = require('../utils')
// const { PachimariClient } = require('../models');
// const Queries = require('../db/Queries');
const Twitter = require('twitter')
const fs = require('fs')

const pathToMovie = 'src/res/hype.gif'
const mediaType = 'image/gif'
const mediaData = fs.readFileSync(pathToMovie)
const mediaSize = fs.statSync(pathToMovie).size

const twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_KEY,
  consumer_secret: process.env.TWITTER_SECRET,
  access_token_key: process.env.TWITTER_TOKEN,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET
})

/**
 * Handling Twitter methods
 */
class Tweets {
  /**
     * Uploads hype gif in three steps:
     * 1. initial upload
     * 2. append file chunks
     * 3. finalize the upload
     */
  async tweetHypeGif () {
    let uploaded = false

    // strt inital upload
    let response = await twitterClient.post('media/upload', {
      command: 'INIT',
      total_bytes: mediaSize,
      media_type: mediaType
    })

    // append media file chunks
    const mediaIdString = response.media_id_string
    response = await twitterClient.post('media/upload', {
      command: 'APPEND',
      media_id: mediaIdString,
      media: mediaData,
      segment_index: 0
    })

    // finalize upload
    response = await twitterClient.post('media/upload', {
      command: 'FINALIZE',
      media_id: mediaIdString
    })

    console.log('UPLOAD SUCCESSFUL')
    console.log(response)

    // post tweet!
    const content = {
      status: 'hype',
      media_ids: mediaIdString
    }
    await twitterClient.post('statuses/update', content, (err, data, response) => {
      if (err) {
        console.log("can't post tweet")
        console.log(err)
      } else {
        console.log('we posted a tweet!')
      }
    })

    uploaded = true
    return uploaded
  }

  /**
     * Gets the hype gif
     * @returns {string} a url of the media
     */
  async getIntentUrl () {
    const og = 'https://twitter.com/intent/tweet?text=Showing%20some%20Overwatch%20League%20hype!!%20link&hashtags=overwatchleague,owl2019&via=PachimariApp'
    const params = { screen_name: 'pictest_' }
    let url
    await twitterClient.get('statuses/user_timeline', params, (err, tweets, response) => {
      if (err || !response) {
        console.log(err)
      } else {
        const tweet = tweets.pop()
        url = og.replace('link', tweet.entities.media[0].url)
        console.log('got media: ' + tweet.entities.media[0].url)
        // url = og.replace('link', tweet.extended_entities.media[0].video_info.variants[0].url);
        console.log(url)
      }
    })
  }

  // /**
  //  *
  //  * @param {string} link
  //  * @returns a new url
  //  */
  // asyncbuildIntentTweet(link) {
  //     let og = "https://twitter.com/intent/tweet?text=Showing%20some%20Overwatch%20League%20hype!!%20link&hashtags=overwatchleague,owl2019&via=PachimariApp";
  //     let newLink = og.replace('link', link);
  //     console.log(newLink);
  //     return newLink;
  // }
  // async watch() {
  //     setInterval(async() => {
  //         let params = {screen_name: "overwatchleague"};
  //         this.twitterClient.get('statuses/user_timeline', params, function(error, tweets, response) {
  //             if (!error) {
  //               console.log(tweets[0].text);
  //             }
  //           });
  //     }, 5000);
  // }
}

module.exports = Tweets
