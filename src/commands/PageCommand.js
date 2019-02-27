'use strict';

const { Command, PachimariEmbed } = require('../models');
const { Logger } = require('../utils');


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
        //const msg = null;
        const embed = new PachimariEmbed(client);
        embed.setTitle("Page Test");
        embed.setDescription(pages[page-1]);
        embed.setFooter(`Page ${page} of ${pages.length}`);
        let mess = embed.buildEmbed().getEmbed;
        // let promise = new Promise(function(resolve, reject) {
        //     resolve(1);
        // });
        // promise.then(function(result) {
        //     embed.buildEmbed().post(message.channel);
        // });
        // promise.then(function(result) {
        //     embed.react(message, "⬅");
        // });
        // promise.then(function(result) {
        //     embed.react(client.message, "➡");

        //         const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅️' && user.id === message.author.id;
        //         const forwardFilter = (reaction, user) => reaction.emoji.name === '➡️' && user.id === message.author.id;

        //         const backwards = message.createReactionCollector(backwardsFilter, { time: 60000 });
        //         const forwards = message.createReactionCollector(forwardFilter, { time: 60000 });

        //         backwards.on('collect', r => {
        //             if (page === 1) return;
        //             page--;
        //             embed.setDescription(pages[page-1]);
        //             embed.setFooter(`Page ${page} of ${pages.length}`);
        //             embed.edit(message.channel);
        //         })

        //         forwards.on('collect', r => {
        //             if (page === pages.length) return;
        //             page++;
        //             embed.setDescription(pages[page+1]);
        //             embed.setFooter(`Page ${page} of ${pages.length}`);
        //             embed.edit(message.channel);
        //     });
        // });

        // promise.catch(function(err) {
        //     Logger.error(err.stack);
        // });



        message.channel.send(mess).then(msg => {
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
                    msg.edit(embed);
                })

                forwards.on('collect', r => {
                    if (page === pages.length) return;
                    page++;
                    embed.setDescription(pages[page+1]);
                    embed.setFooter(`Page ${page} of ${pages.length}`);
                    msg.edit(embed);
                });
            })
        });

    }
}
module.exports = PageCommand;