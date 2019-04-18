'use strict';

const { Command, PachimariEmbed } = require('../../../models');
const { CompetitorManager, PlayerManager } = require('../../../models/owl_models');
const { Emojis } = require('../../../constants');
const { MessageUtil, NumberUtil } = require('../../../utils');
const heroes = require('../../../data/heroes.json');


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
        let embed = new PachimariEmbed(client);
        
        if (args.length > 1) {
            loading.then(message => message.delete());
            MessageUtil.sendError(message.channel, "Make sure you use the format \`!player [hero]\`");
            return;
        }
        else if (args.length === 1) {
            let hero, revisedHero;
            let heroColor, heroURL, heroTitle;
            if (args[0].toLowerCase() == "soldier76") {
                revisedHero = this.getHeroName("soldier-76");
                heroColor = this.getHeroColor("soldier-76");
                heroURL = this.getHeroURL("soldier-76");
                heroTitle = this.getHeroTitle("soldier-76");
             } else if (args[0].toLowerCase() == "wreckingball") {
                revisedHero = this.getHeroName("wrecking-ball");
                heroColor = this.getHeroColor("wrecking-ball");
                heroURL = this.getHeroURL("wrecking-ball");
                heroTitle = this.getHeroTitle("wrecking-ball");
             } else {
                hero = this.getHeroName(args[0]);
                heroColor = this.getHeroColor(args[0]);
                heroURL = this.getHeroURL(args[0]);
                heroTitle = this.getHeroTitle(args[0]);
             } 
            let list = PlayerManager.players.array().sort(this.compare);
            if (hero != undefined || revisedHero != undefined) {
                loading.then(message => message.edit(`${Emojis["LOADING"]} Loading players with time on ${heroTitle} ${Emojis[args[0].toUpperCase()]}`))
                for (const player of list) {
                    let competitor = CompetitorManager.competitors.get(player.competitorId);
                    let competitorHeroes = await PlayerManager.getHeroes(player);
                    let query = revisedHero != undefined ? revisedHero : hero;
        
                    for (let i = 0; i < competitorHeroes.length; i++) {
                        if (competitorHeroes[i].name == query) {
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
                }
                pages.push(players);
                embed.setTitle(`__Overwatch League Players with Time on ${heroTitle}__`);
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
        }

        loading.then(message => message.delete());
        embed.setDescription(pages[page - 1]);

        if (pages.length > 1) {
            embed.setFooter(`Page ${page} of ${pages.length}`);
            let mess = embed.buildEmbed().getEmbed;
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
        } else {
            embed.buildEmbed().post(message.channel);
        }
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
                if (key === 'wrecking-ball') {
                    return 'wreckingball';
                }
                return heroes[i].key;
            }
        }
    }

    getHeroTitle(val) {
        const key = val.toLowerCase();
        for (let i = 0; i < heroes.length; i++) {
            if (heroes[i].key === key) {
                return heroes[i].title;
            }
        }
    }

    getHeroColor(val) {
        const key = val.toLowerCase();
        for (let i = 0; i < heroes.length; i++) {
            if (heroes[i].key === key) {
                return heroes[i].color;
            }
        }
    }

    getHeroURL(val) {
        const key = val.toLowerCase();
        for (let i = 0; i < heroes.length; i++) {
            if (heroes[i].key === key) {
                return heroes[i].portrait;
            }
        }
    }
}
module.exports = PlayersCommand;