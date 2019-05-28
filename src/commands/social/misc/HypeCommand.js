'use strict';

const { Command } = require('../../../models');
const { HypeGif } = require('../../../models/owl_models')
const { Emojis } = require('../../../constants');
const fs = require('fs');

//const { Tweets } = require('../../../social')
//const { Emoji } = require('discord.js');
//const open = require('open');

class HypeCommand extends Command {
    constructor() {
        super();
        this.name = "hype";
        this.description = "Show some hype for your fav team";
        this.usage = "hype <teamname>";
        this.aliases = [];
    }

    async execute(client, message, args) {
        let loading = message.channel.send(Emojis["LOADING"]);
        let hype = new HypeGif();
        //let tweet = new Tweets();
        await hype.buildHypeGif(message.author.avatarURL.replace(/(gif|webp)/g, 'png'));
        loading.then(msg => {
            fs.readdir("src/res/", function(err, files) {
                let gif = "src/res/hype.gif";
                msg.edit("<a:hype:550886762004873222><a:hype:550886762004873222><a:hype:550886762004873222><a:hype:550886762004873222><a:hype:550886762004873222><a:hype:550886762004873222><a:hype:550886762004873222><a:hype:550886762004873222><a:hype:550886762004873222>").then(m => {
                    message.channel.send({
                        files: [gif]
                    });
                    // }).then(m => {
                    //     m.react('548532720142254081');

                    //     const twitterFilter = (reaction, user) => reaction.emoji.id === '548532720142254081' && user.id === message.author.id;
                    //     const twitter = m.createReactionCollector(twitterFilter);
                    //     twitter.on('collect', async r => {
                    //         await r.remove(message.author.id);
                    //         // 1. tweet hype gif to dummy account
                    //         // 2. get tweet for hype gif
                    //         // 3. find gif url 
                    //         // 4. add the url to the intent tweet
                    //         //await tweet.tweetHypeGif();
                    //         const mediaLink = await tweet.getIntentUrl();
                    //         console.log(mediaLink);
                    //        // const url = tweet.buildIntentTweet(String(mediaLink));
                    //         //await open(url);
                    //         return;
                    //     })
                    // })
                })
            });
        });
    }
}
module.exports = HypeCommand;