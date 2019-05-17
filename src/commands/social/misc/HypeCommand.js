'use strict';

const { Command, PachimariEmbed } = require('../../../models');
const { HypeGif } = require('../../../models/owl_models')
const { Emojis } = require('../../../constants');
const fs = require('fs');

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
        await hype.buildHypeGif(message.author.avatarURL.replace(/(gif|webp)/g, 'png'));
        loading.then(msg => {
            fs.readdir("src/res/", function(err, files) {
                let gif = "src/res/hype.gif";
                msg.edit("<a:hype:550886762004873222><a:hype:550886762004873222><a:hype:550886762004873222><a:hype:550886762004873222><a:hype:550886762004873222><a:hype:550886762004873222><a:hype:550886762004873222><a:hype:550886762004873222><a:hype:550886762004873222>").then(m => {
                    message.channel.send({
                        files: [gif]
                    }).then(m => {
                        m.react(Emojis["TWITTER"]);
                    })
                })
            });
        });
        // message.channel.send({
        //     files: [{
        //       attachment: 'src/res/hype.gif',
        //       name: 'hype.gif'
        //     }]
        // });
    }
}
module.exports = HypeCommand;