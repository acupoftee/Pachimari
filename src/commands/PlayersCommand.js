'use strict';

const { Command, PachimariEmbed } = require('../models');
const { CompetitorManager, PlayerManager } = require('../models/owl_models');
const { Emojis } = require('../constants');
const { MessageUtil } = require('../utils');

class PlayersCommand extends Command {
    constructor() {
        super();
        this.name = 'players';
        this.description = 'Lists all Overwatch league players';
        this.usage = 'players';
        this.aliases = [];
    }

    async execute(client, message, args) {
        let loading = message.channel.send(Emojis["LOADING"]);
        let pages = [];
        let page = 1, playerCount = 1;
        let players = [];
        PlayerManager.players.sort(this.compare).forEach(player => {
            let competitor = CompetitorManager.competitors.get(player.competitorId);
            let teamoji = Emojis[competitor.abbreviatedName];
            players.push(`${MessageUtil.getFlag(player.nationality)} ${teamoji} ${
                Emojis[player.role.toUpperCase()]} ${
                player.givenName} '**${player.name}**' ${player.familyName}`);
            if (playerCount % 20 == 0) {
                pages.push(players);
                players = [];
            }
            playerCount++;
        });
        pages.push(players);
        const embed = new PachimariEmbed(client);
        embed.setTitle('__Overwatch League Players__');
        embed.setDescription(pages[page - 1]);
        embed.setFooter(`Page ${page} of ${pages.length}`);
        let mess = embed.buildEmbed().getEmbed;
        loading.then(message => message.delete());
        message.channel.send(mess).then(msg => {
            msg.react("⬅").then(r => {
                msg.react("➡");

                const backwardsFilter = (reaction, user) => reaction.emoji.name === "⬅" && user.id === message.author.id;
                const forwardFilter = (reaction, user) => reaction.emoji.name === "➡" && user.id === message.author.id;

                const backwards = msg.createReactionCollector(backwardsFilter, { time: 200000 });
                const forwards = msg.createReactionCollector(forwardFilter, { time: 200000 }); // { time: 100000 }

                backwards.on('collect', r => {
                    if (page === 1) return;
                    page--;
                    embed.setDescription(pages[page - 1]);
                    embed.setFooter(`Page ${page} of ${pages.length}`);
                    msg.edit(embed.buildEmbed().getEmbed);
                });

                forwards.on('collect', r => {
                    if (page === pages.length) return;
                    page++;
                    embed.setDescription(pages[page - 1]);
                    embed.setFooter(`Page ${page} of ${pages.length}`);
                    msg.edit(embed.buildEmbed().getEmbed);
                });
            });
        });
    }

    compare(a, b) {
        if (a.name.toLowerCase() < b.name.toLowerCase())
            return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase())
            return 1;
        return 0;
    }
}
module.exports = PlayersCommand;