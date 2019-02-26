'use strict';

const { Command, PachimariEmbed } = require('../models');


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
        const embed = new PachimariEmbed(client);
        embed.setTitle("Page Test");
        embed.setDescription(pages[page-1]);
        //let mess = embed.buildEmbed();
        let promise = new Promise(function(resolve, reject) {
            resolve(1);
        });
        promise.then(function(result) {
            embed.buildEmbed().post(message.channel);
        });
        promise.then(function(result) {
            message.react("550089962528440320").then(r => {
                message.react("550089858123825152");

                const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅️' && user.id === message.author.id;
                const forwardFilter = (reaction, user) => reaction.emoji.name === '➡️' && user.id === message.author.id;

                const backwards = message.CreateReactionCollector(backwardsFilter, { time: 60000 });
                const forwards = message.CreateReactionCollector(forwardFilter, { time: 60000 });

                backwards.on('collect', r => {
                    if (page === 1) return;
                    page--;
                    embed.setDescription(pages[page-1]);
                    embed.setFooter(`Page ${page} of ${pages.length}`);
                    embed.edit(message.channel);
                })

                forwards.on('collect', r => {
                    if (page === pages.length) return;
                    page++;
                    embed.setDescription(pages[page+1]);
                    embed.setFooter(`Page ${page} of ${pages.length}`);
                    embed.edit(message.channel);
            });
        });
        promise.catch(function(err) {
            Logger.error(err.stack);
        });
    });



        // message.channel.send(mess).then(msg => {
        //     msg.react('➡️').then(r => {
        //         msg.react('⬅️');

        //         const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅️' && user.id === message.author.id;
        //         const forwardFilter = (reaction, user) => reaction.emoji.name === '➡️' && user.id === message.author.id;

        //         const backwards = msg.CreateReactionCollector(backwardsFilter, { time: 60000 });
        //         const forwards = msg.CreateReactionCollector(forwardFilter, { time: 60000 });

        //         backwards.on('collect', r => {
        //             if (page === 1) return;
        //             page--;
        //             embed.setDescription(pages[page-1]);
        //             embed.setFooter(`Page ${page} of ${pages.length}`);
        //             msg.edit(embed);
        //         })

        //         forwards.on('collect', r => {
        //             if (page === pages.length) return;
        //             page++;
        //             embed.setDescription(pages[page+1]);
        //             embed.setFooter(`Page ${page} of ${pages.length}`);
        //             msg.edit(embed);
        //         });
        //     })
        // });

    }
}
module.exports = PageCommand;