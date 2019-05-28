'use strict';

const { Command, PachimariEmbed } = require('../../../models');
const { CompetitorManager, PlayerManager, HeroManager } = require('../../../models/owl_models');
const { Emojis } = require('../../../constants');
const { MessageUtil, NumberUtil } = require('../../../utils');

class TopTenCommand extends Command {
    constructor() {
        super();
        this.name = "top10";
        this.description = "Show's the top ten players for damage and healing";
        this.usage = "top10";
        this.aliases = [];
    }
    async execute(client, message, args) {
        // http://www.williammalone.com/articles/html5-canvas-javascript-bar-graph/ 
        // finds the top ten damage and healing stats for each concluded stage
        // 1. get player stats
        // 2. sort by damage
        // 3. push top 10 into an array
        // 4. sort by healing
        // 5. push top 10 into array
        // send embed
        let loading = message.channel.send(Emojis["LOADING"]);
        let pages = [], titles = ["__Top Ten Eliminators__", "__Top Ten Healers__"];
        let page = 1;
        let topTenElims = [], topTenHealing = [];
        // let topElimHeroes = [], topHealingHeroes = [];
        let elimEmbedInfo = [], healerEmbedInfo = [];
        let players = PlayerManager.players.array();

        // load top ten eliminators
        players.sort((a, b) => b.eliminations - a.eliminations);
        for (let i = 0; i < 10; i++) {
            topTenElims.push(players[i]);
        }

        // load top ten healers
        players.sort((a, b) => b.healing - a.healing);
        for (let j = 0; j < 10; j++){
            topTenHealing.push(players[j]);
        }

        let embed = new PachimariEmbed(client);
        for (let k = 0; k < 10; k++) {
            // push player's elim info into the embed description
            let elimPlayer = topTenElims[k];
            let topElimHeroes = ``;
            let elimTeam = CompetitorManager.competitors.get(elimPlayer.competitorId);
            let elimTeamoji = Emojis[elimTeam.abbreviatedName];

            let elimDescription = `${k+1}. ${elimTeamoji} **${elimPlayer.name}**:\nElims: ${elimPlayer.eliminations.toFixed(1)}`
            // if (elimPlayer.heroes.length > 0) {
            //     elimPlayer.heroes.forEach(hero => {
            //         let heroMoji = Emojis[hero.replace(/[.:\-]/, '').toUpperCase()];
            //         topElimHeroes = topElimHeroes + `${heroMoji}`;
            //     });
            //     elimDescription = elimDescription + `Heroes: ${topElimHeroes}`;
            // }
            elimEmbedInfo.push(elimDescription);

            // push player's healer info into the embed description
            let healPlayer = topTenHealing[k];
            let topHealHeroes = ``;
            let healTeam = CompetitorManager.competitors.get(healPlayer.competitorId);
            let healTeamoji = Emojis[healTeam.abbreviatedName];

            let healDescription = `${k+1}. ${healTeamoji} **${healPlayer.name}**:\nHealing: ${healPlayer.healing.toFixed(1)}`
            // if (healPlayer.heroes.length > 0) {
            //     healPlayer.heroes.forEach(hero => {
            //         let heroMoji = Emojis[hero.replace(/[.:-\-]/, '').toUpperCase()];
            //         topHealHeroes = topHealHeroes + `${heroMoji}`;
            //     });
            //     healDescription = healDescription + `Heroes: ${topHealHeroes}`;
            // }
            healerEmbedInfo.push(healDescription);
        }
        pages.push(elimEmbedInfo);
        pages.push(healerEmbedInfo);
        embed.setTitle(titles[page-1]);
        embed.setDescription(pages[page-1]);
        embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages`);
        let mess = embed.buildEmbed().getEmbed;
        loading.then(message => message.edit(mess)).then(msg => {
            msg.react("🔄").then(r => {
                const switchFilter = (reaction, user) => reaction.emoji.name === "🔄" && user.id === message.author.id;
                const refresh = msg.createReactionCollector(switchFilter, { time: 60000 });
                refresh.on('collect', r => {
                    if (page % 2 == 0) {
                        page--;
                        embed.setTitle(titles[page-1]);
                    } else {
                        page++;
                        embed.setTitle(titles[page-1]);
                    }
                    embed.setDescription(pages[page - 1]);
                    embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages`);
                    msg.edit(embed.buildEmbed().getEmbed);
                    r.remove(message.author.id);
                })
            })
        })
    }
}
module.exports = TopTenCommand;