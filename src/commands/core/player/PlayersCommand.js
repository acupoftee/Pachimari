'use strict';

const { Command, PachimariEmbed } = require('../../../models');
const { CompetitorManager, PlayerManager, HeroManager } = require('../../../models/owl_models');
const { Emojis } = require('../../../constants');
const { MessageUtil, AlertUtil, Logger } = require('../../../utils');
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
            loading.then(message => message.edit(AlertUtil.ERROR("Make sure you use the format \`!players [hero]\`")));
            return;
        }
        else if (args.length === 1) {
            let heroColor, heroURL, heroTitle, revisedHero;
            let hero = HeroManager.locateHero(args[0]);
            if (hero == 'wrecking-ball') {
                revisedHero = 'wreckingball';
            }
            if (hero == undefined) {
                loading.then(message => message.edit(AlertUtil.ERROR("Sorry, I couldn't find that hero. Maybe a typo?")));
                return;
            }
            heroColor = HeroManager.getHeroColor(hero);
            heroURL = HeroManager.getHeroURL(hero);
            heroTitle = HeroManager.getHeroTitle(hero);

            let list = PlayerManager.players.array().sort(this.compare);
            if (hero != undefined || revisedHero != undefined) {
                loading.then(message => message.edit(`${Emojis["LOADING"]} Loading players with time on ${heroTitle} ${Emojis[hero.replace('-', '').toUpperCase()]}`))
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
                loading.then(message => message.edit(AlertUtil.ERROR("Sorry, I couldn't find that hero :C maybe a typo?")));
                return;
            }
        } else if (args.length === 0) {
            Logger.custom(`PLAYERS_COMMAND`, `Loading league players`);
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

        //loading.then(message => message.delete());
        embed.setDescription(pages[page - 1]);

        if (pages.length > 1) {
            embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages.`);
            let mess = embed.buildEmbed().getEmbed;
            loading.then(message => message.edit(mess)).then(msg => {
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
                        embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages.`);
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
                        embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages.`);
                        await r.remove(message.author.id);
                        msg.edit(embed.buildEmbed().getEmbed);
                    });
                });
            });
        } else {
            let mess = embed.buildEmbed().getEmbed;
            loading.then(message => message.edit(mess));
        }
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