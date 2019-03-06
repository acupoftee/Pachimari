'use strict';

const { Command, PachimariEmbed } = require('../models');
const { Emojis } = require('../constants');


class PageCommand extends Command {
    constructor() {
        super();
        this.name = 'page';
        this.description = 'test page';
        this.usage = 'page';
        this.aliases = [];
    }

    async execute(client, message, args) {
        let pages = ["This is the first page", "This is the second", "third", "fourth", "i can do this!"];
        let page = 1;
        let embed = new PachimariEmbed(client);
        embed.setTitle("Page Test");
        embed.setDescription(pages[page-1]);
        embed.setFooter(`Page ${page} of ${pages.length}`);
        let mess = embed.buildEmbed().getEmbed;
        let loading = message.channel.send(Emojis["LOADING"]);

        message.channel.send(mess).then(msg => {
            //loading.then(message => message.edit(""));
            loading.then(message => message.delete());
            msg.react("⬅").then(r => {
                msg.react("➡");
                const backwardsFilter = (reaction, user) => reaction.emoji.name === "⬅" && user.id === message.author.id;
                const forwardFilter = (reaction, user) => reaction.emoji.name === "➡" && user.id === message.author.id;

                const backwards = msg.createReactionCollector(backwardsFilter, { time: 60000 });
                const forwards = msg.createReactionCollector(forwardFilter, { time: 60000 });

                backwards.on('collect', r => {
                    if (page === 1) return;
                    page--;
                    embed.setDescription(pages[page-1]);
                    embed.setFooter(`Page ${page} of ${pages.length}`);
                    msg.edit(embed.buildEmbed().getEmbed);
                })

                forwards.on('collect', r => {
                    if (page === pages.length) return;
                    page++;
                    embed.setDescription(pages[page-1]);
                    embed.setFooter(`Page ${page} of ${pages.length}`);
                    msg.edit(embed.buildEmbed().getEmbed);
                });
            })
        });

    }
}
module.exports = PageCommand;