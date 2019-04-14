'use strict';

const { Command, PachimariEmbed } = require('../../../models');
const { CompetitorManager, PlayerManager } = require('../../../models/owl_models');
const { Emojis } = require('../../../constants');
const { MessageUtil } = require('../../../utils');
const { MessageReaction } = require('discord.js');
const heroes = require('../../../data/heroes.json');
let heroColor, heroURL, heroTitle;

class PlayersCommand extends Command {
    constructor() {
        super();
        this.name = 'players';
        this.description = 'Lists all Overwatch league players';
        this.usage = 'players [hero]';
        this.aliases = [];
    }

    async execute(client, message, args) {
        let loading = message.channel.send(Emojis["LOADING"]);
        let pages = [];
        let page = 1, playerCount = 1;
        let players = [];
        const embed = new PachimariEmbed(client);

        if (args.length === 1) {
            const hero = this.getHeroName(args[0]);
            if (hero !== undefined) {
                for (const player of PlayerManager.players.sort(this.compare)) {
                    let competitor = CompetitorManager.competitors.get(player.competitorId);
                    let competitorHeroes = await PlayerManager.getHeroes(player);
                    if (competitorHeroes.includes(hero)) {
                        let teamoji = Emojis[competitor.abbreviatedName];
                        players.push(`${MessageUtil.getFlag(player.nationality)} ${teamoji} ${
                            Emojis[player.role.toUpperCase()]} ${
                            player.givenName} '**${player.name}**' ${player.familyName}`);
                        if (playerCount % 20 == 0) {
                            pages.push(players);
                            players = [];
                        }
                        playerCount++;
                    }
                }
                embed.setTitle(`__Overwatch League Players with Time on ${heroTitle}__`);
                embed.setDescription(pages[page - 1]);
                embed.setFooter(`Page ${page} of ${pages.length}`);
                embed.setColor(heroColor);
                embed.setThumbnail(heroURL);
            } else {
                loading.then(message => message.delete());
                MessageUtil.sendError(message.channel, "Sorry, I couldn't find that hero :C maybe a typo?");
                return;
            }
        } else if (args.length === 0) {
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

            embed.setTitle('__Overwatch League Players__');
            embed.setDescription(pages[page - 1]);
            embed.setFooter(`Page ${page} of ${pages.length}`);
        }
        
        let mess = embed.buildEmbed().getEmbed;
        loading.then(message => message.delete());
        message.channel.send(mess).then(msg => {
            msg.react("⬅").then(r => {
                msg.react("➡");

                const backwardsFilter = (reaction, user) => reaction.emoji.name === "⬅" && user.id === message.author.id;
                const forwardFilter = (reaction, user) => reaction.emoji.name === "➡" && user.id === message.author.id;

                const backwards = msg.createReactionCollector(backwardsFilter, { time: 200000 });
                const forwards = msg.createReactionCollector(forwardFilter, { time: 200000 }); // { time: 100000 }

                backwards.on('collect', async r => {
                    if (page === 1) {
                        await r.remove(message.author.id);
                        return;
                    }
                    page--;
                    embed.setDescription(pages[page - 1]);
                    embed.setFooter(`Page ${page} of ${pages.length}`);
                    await r.remove(message.author.id);
                    msg.edit(embed.buildEmbed().getEmbed);
                });

                forwards.on('collect', async r => {
                    if (page === pages.length) {
                        await r.remove(message.author.id);
                        return;
                    }
                    page++;
                    embed.setDescription(pages[page - 1]);
                    embed.setFooter(`Page ${page} of ${pages.length}`);
                    await r.remove(message.author.id);
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

    /**
     * Returns a hero name
     * @param {string} val 
     * @returns hero name
     */
    getHeroName(val) {
        const key = val.toLowerCase();
        for (let i = 0; i < heroes.length; i++) {
            if (heroes[i].key === key) {
                heroURL = heroes[i].portrait;
                heroColor = heroes[i].color;
                heroTitle = heroes[i].title;
                return heroes[i].key;
            } 
        }
    }
}
module.exports = PlayersCommand;