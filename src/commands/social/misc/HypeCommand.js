'use strict';

const { Command } = require('../../../models');
const { HypeGif } = require('../../../models/owl_models')
const { Emojis } = require('../../../constants');
const { Logger } = require('../../../utils')
const fs = require('fs');

class HypeCommand extends Command {
    constructor() {
        super();
        this.name = "hype";
        this.description = "Show some hype for your fav team";
        this.usage = "hype";
        this.aliases = [];
    }

    async execute(client, message, args) {
        let loading = message.channel.send(Emojis["LOADING"]);
        let hype = new HypeGif();
        Logger.custom('HYPE', 'USING HYPE COMMAND');
        await hype.buildHypeGif(message.author.avatarURL.replace(/(gif|webp)/g, 'png'));
        loading.then(msg => {
            fs.readdir("src/res/", function(err, files) {
                let gif = "src/res/hype.gif";
                msg.edit("<a:hype:550886762004873222><a:hype:550886762004873222><a:hype:550886762004873222><a:hype:550886762004873222><a:hype:550886762004873222><a:hype:550886762004873222><a:hype:550886762004873222><a:hype:550886762004873222><a:hype:550886762004873222>").then(m => {
                    message.channel.send({
                        files: [gif]
                    })
                })
            });
        });
    }
}
module.exports = HypeCommand;