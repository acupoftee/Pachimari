'use strict';

const { Command, PachimariEmbed } = require('../../../models');
const { CompetitorManager, PlayerManager, HeroManager } = require('../../../models/owl_models');
const { Emojis } = require('../../../constants');
const { MessageUtil } = require('../../../utils');
let query;

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
            MessageUtil.sendError(message.channel, "Make sure you use the format \`!players [hero]\`");
            return;
        }
        else if (args.length === 1) {

            let heroColor, heroURL, heroTitle, revisedHero;
            let playersWithSaidHero = [];

            let hero = HeroManager.locateHero(args[0]);
            if (hero == 'wrecking-ball') {
                revisedHero = 'wreckingball';
            }
            if (hero == undefined) {
                loading.then(message => message.delete());
                MessageUtil.sendError(message.channel, "Sorry, I couldn't find that hero. Maybe a typo?");
                return;
            }
            heroColor = HeroManager.getHeroColor(hero);
            heroURL = HeroManager.getHeroURL(hero);
            heroTitle = HeroManager.getHeroTitle(hero);
            let query =  revisedHero != undefined ? revisedHero : hero;

            let list = PlayerManager.players.array();
            if (query != undefined) {
                loading.then(message => message.edit(`${Emojis["LOADING"]} Loading players with time on ${heroTitle} ${Emojis[hero.replace('-', '').toUpperCase()]}`))
                for (const player of list) {
                    // let competitorHeroes = player.playedHeroes;
                    // for (let i = 0; i < competitorHeroes.size; i++) {
                    //     if (competitorHeroes[.name == query) {
                    //         // let teamoji = Emojis[competitor.abbreviatedName];
                    //         // // players.push(`${MessageUtil.getFlag(player.nationality)} ${teamoji} ${
                    //         // //     Emojis[player.role.toUpperCase()]} ${
                    //         // //     player.givenName} '**${player.name}**' ${player.familyName}`);
                    //         playersWithSaidHero.push(player);
                    //     }
                    // }
                    //console.log(player.playedHeroes.get(query))
                    if (player.playedHeroes.get(query)) {
                        playersWithSaidHero.push(player);
                    } else {
                        console.log("this player doesn't play " + query);
                    }
                }
                console.log(playersWithSaidHero.size);
                playersWithSaidHero.sort((a, b) => b.playedHeroes.get(query).timePlayed - a.playedHeroes.get(query).timePlayed);
                let playerCount = 0;
                for (const player of playersWithSaidHero) {
                    playerCount++;
                    let competitor = CompetitorManager.competitors.get(player.competitorId);
                    let teamoji = Emojis[competitor.abbreviatedName];
                            players.push(`${MessageUtil.getFlag(player.nationality)} ${teamoji} ${
                                Emojis[player.role.toUpperCase()]} ${
                                player.givenName} '**${player.name}**' ${player.familyName}`);
                    if (playerCount % 20 === 0) {
                        pages.push(players);
                        players = [];
                    }
                }
                this.getTimePlayed(playersWithSaidHero[0], playersWithSaidHero[1]);
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

        embed.setDescription(pages[page - 1]);

        if (pages.length > 1) {
            embed.setFooter(`Page ${page} of ${pages.length}`);
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

    getTimePlayed(a, b) {
        let playerOne = a.playedHeroes;//.filter((hero) => hero.name === query);
        let playerTwo = b.playedHeroes;//.filter((hero) => hero.name === query);
        console.log(playerOne);
        console.log(playerTwo);
        //console.log("Player One " + playerTwo.get(query));
        //console.log("Player Two " + playerOne.get(query));
    }
    compareHeroTimePlayed(a, b) {
        console.log(a.playedHeroes);
        console.log(b.playedHeroes);
        //console.log(JSON.stringify(a.playedHeroes));
        let playerOne = a.playedHeroes.filter((hero) => hero.name === query);
        let playerTwo = b.playedHeroes.filter((hero) => hero.name === query);

        let firstTime = playerOne.get(query).timePlayed;
        let secondTime = playerTwo.get(query).timePlayed;

        console.log("Player One Time" + firstTime);
        console.log("Player Two Time" + secondTime);

        console.log("Player One " + playerTwo.get(query));
        console.log("Player Two " + playerOne.get(query));
        
        return secondTime - firstTime;
    }
}
module.exports = PlayersCommand;