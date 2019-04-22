'use strict';

const { Command, PachimariEmbed } = require('../../../models');
const { CompetitorManager, PlayerManager} = require('../../../models/owl_models');
const { MessageUtil, AlertUtil, NumberUtil } = require('../../../utils');
const { Emojis } = require('../../../constants');
const heroes = require('../../../data/heroes.json');


class CompareCommand extends Command {
    constructor() {
        super();
        this.name = 'compare';
        this.description = 'Compares stats between two players';
        this.usage = 'compare <first> <second>';
        this.aliases = ['playercompare'];
    }

    async execute(client, message, args) {
        let loading = message.channel.send(Emojis["LOADING"]);
        loading.then(async message => message.edit(await(this.buildMessage(client, args))));
    }

    async buildMessage(client, args) {
        if (args.length <= 1 || args.length > 3) {
            return AlertUtil.ERROR("Please specify 2 Overwatch League Player to compare stats and a hero name if you want hero stats!");
        } else if (args[2] !== undefined && (args[2].toLowerCase() == "soldier76" || args[2].toLowerCase() == "wreckingball")) {
            console.log("this hero works");
        } else if ((args[2] !== undefined && this.getHeroName(args[2]) === undefined)) {
            console.log(this.getHeroName(args[2]));
            return AlertUtil.ERROR(":C Sorry I couldn't find that hero. Maybe a typo?")
        }

        const firstId = PlayerManager.locatePlayer(args[0]), 
              secondId = PlayerManager.locatePlayer(args[1]);
        const firstPlayer = PlayerManager.players.get(firstId), 
              secondPlayer = PlayerManager.players.get(secondId);


        if (firstPlayer === undefined || secondPlayer === undefined) {
            return AlertUtil.ERROR("Sorry, couldn't find any info :C");
        }

        const embed = new PachimariEmbed(client);
        const firstCompetitor = CompetitorManager.competitors.get(firstPlayer.competitorId), 
              secondCompetitor = CompetitorManager.competitors.get(secondPlayer.competitorId);
        const firstEmoji = Emojis[firstCompetitor.abbreviatedName], 
              secondEmoji = Emojis[secondCompetitor.abbreviatedName];

        if (args.length === 3) {
            let heroURL, heroTitle, heroColor, heroUlt;
            let firstPlayerHeroes = await PlayerManager.getHeroes(firstPlayer),
                secondPlayerHeroes = await PlayerManager.getHeroes(secondPlayer);
            let firstIndex = -1, secondIndex = -1;
 

            for (let i = 0; i < firstPlayerHeroes.length; i++) {
                if (args[2].toLowerCase() == "soldier76" && firstPlayerHeroes[i].name == "soldier-76") {
                    firstIndex = i;
                    heroColor = this.getHeroColor("soldier-76");
                    heroURL = this.getHeroURL("soldier-76");
                    heroTitle = this.getHeroTitle("soldier-76");
                    heroUlt = this.getHeroUltimate("soldier-76");
                    break;
                } else if (args[2].toLowerCase() == "wreckingball" && firstPlayerHeroes[i].name == "wreckingball") {
                    firstIndex = i;
                    heroColor = this.getHeroColor("wrecking-ball");
                    heroURL = this.getHeroURL("wrecking-ball");
                    heroTitle = this.getHeroTitle("wrecking-ball");
                    heroUlt = this.getHeroUltimate("wrecking-ball");
                    break;
                }
                else if (firstPlayerHeroes[i].name == args[2].toLowerCase()) {
                    firstIndex = i;
                    let h = args[2].toLowerCase();
                    heroColor = this.getHeroColor(h);
                    heroURL = this.getHeroURL(h);
                    heroTitle = this.getHeroTitle(h);
                    heroUlt = this.getHeroUltimate(h);
                    break;
                }
            }

            for (let i = 0; i < secondPlayerHeroes.length; i++) {
                if (args[2].toLowerCase() == "soldier76" && secondPlayerHeroes[i].name == "soldier-76") {
                    secondIndex = i;
                    heroColor = this.getHeroColor("soldier-76");
                    heroURL = this.getHeroURL("soldier-76");
                    heroTitle = this.getHeroTitle("soldier-76");
                    heroUlt = this.getHeroUltimate("soldier-76");
                    break;
                } else if (args[2].toLowerCase() == "wreckingball" && secondPlayerHeroes[i].name == "wreckingball") {
                    secondIndex = i;
                    heroColor = this.getHeroColor("wrecking-ball");
                    heroURL = this.getHeroURL("wrecking-ball");
                    heroTitle = this.getHeroTitle("wrecking-ball");
                    heroUlt = this.getHeroUltimate("wrecking-ball");
                    break;
                }
                else if (secondPlayerHeroes[i].name == args[2].toLowerCase()) {
                    secondIndex = i;
                    let h = args[2].toLowerCase();
                    heroColor = this.getHeroColor(h);
                    heroURL = this.getHeroURL(h);
                    heroTitle = this.getHeroTitle(h);
                    heroUlt = this.getHeroUltimate(h);
                    break;
                }
            }
            // potential portrait url https://d1u1mce87gyfbn.cloudfront.net/hero/ana/icon-portrait.png
            embed.setTitle(`${firstEmoji} ${firstPlayer.givenName} '**${firstPlayer.name}**' ${firstPlayer.familyName} vs ${secondPlayer.givenName} '**${secondPlayer.name}**' ${secondPlayer.familyName} ${secondEmoji}\n on **${heroTitle}**`);
            let firstInfo = [], secondInfo = [];

            if (firstIndex == -1) {
                firstInfo.push(`Time Played: **0.00**`);
                firstInfo.push(`Eliminations: **0.00**`);
                firstInfo.push(`Deaths: **0.00**`);
                firstInfo.push(`Hero Damage: **0.00**`);
                firstInfo.push(`Healing: **0.00**`);
                firstInfo.push(`${heroUlt}s Earned: **0.00**`);
                firstInfo.push(`Final Blows: **0.00**`);
            } else {
                firstInfo.push(`Time Played: **${NumberUtil.toTimeString(firstPlayerHeroes[firstIndex].stats.time_played_total)}**`);    
                firstInfo.push(`Eliminations: **${firstPlayerHeroes[firstIndex].stats.eliminations_avg_per_10m.toFixed(2)}**`);    
                firstInfo.push(`Deaths: **${firstPlayerHeroes[firstIndex].stats.deaths_avg_per_10m.toFixed(2)}**`);    
                firstInfo.push(`Hero Damage: **${firstPlayerHeroes[firstIndex].stats.hero_damage_avg_per_10m.toFixed(2)}**`);    
                firstInfo.push(`Healing: **${firstPlayerHeroes[firstIndex].stats.healing_avg_per_10m.toFixed(2)}**`);    
                firstInfo.push(`${heroUlt}s Earned: **${firstPlayerHeroes[firstIndex].stats.ultimates_earned_avg_per_10m.toFixed(2)}**`);                
                firstInfo.push(`Final Blows: **${firstPlayerHeroes[firstIndex].stats.final_blows_avg_per_10m.toFixed(2)}**`);
            }
            if (secondIndex == -1) {
                secondInfo.push(`Time Played: **0.00**`);
                secondInfo.push(`Eliminations: **0.00**`);
                secondInfo.push(`Deaths: **0.00**`);
                secondInfo.push(`Hero Damage: **0.00**`);
                secondInfo.push(`Healing: **0.00**`);
                secondInfo.push(`${heroUlt}s Earned: **0.00**`);
                secondInfo.push(`Final Blows: **0.00**`);
            } else {
                secondInfo.push(`Time Played: **${NumberUtil.toTimeString(secondPlayerHeroes[secondIndex].stats.time_played_total)}**`);
                secondInfo.push(`Eliminations: **${secondPlayerHeroes[secondIndex].stats.eliminations_avg_per_10m.toFixed(2)}**`);
                secondInfo.push(`Deaths: **${secondPlayerHeroes[secondIndex].stats.deaths_avg_per_10m.toFixed(2)}**`);
                secondInfo.push(`Hero Damage: **${secondPlayerHeroes[secondIndex].stats.hero_damage_avg_per_10m.toFixed(2)}**`);
                secondInfo.push(`Healing: **${secondPlayerHeroes[secondIndex].stats.healing_avg_per_10m.toFixed(2)}**`);
                secondInfo.push(`${heroUlt}s Earned: **${secondPlayerHeroes[secondIndex].stats.ultimates_earned_avg_per_10m.toFixed(2)}**`);
                secondInfo.push(`Final Blows: **${secondPlayerHeroes[secondIndex].stats.final_blows_avg_per_10m.toFixed(2)}**`);
            }

            embed.addFields(`__${MessageUtil.capitalize(firstPlayer.name)}'s Info__`, firstInfo, true);
            embed.addFields(`__${MessageUtil.capitalize(secondPlayer.name)}'s Info__`, secondInfo, true);

            embed.setFooter('Stats are per 10 minutes, except for Time Played.');
            embed.setThumbnail(heroURL);
            embed.setColor(heroColor);
            embed.buildEmbed();
            return { embed: embed.getEmbed };

        } else {
            const firstStats = await PlayerManager.updateStats(firstPlayer);
            firstPlayer.setEliminations(firstStats[0]);
            firstPlayer.setDeaths(firstStats[1]);
            firstPlayer.setHeroDamage(firstStats[2]);
            firstPlayer.setHealing(firstStats[3]);
            firstPlayer.setUltimates(firstStats[4]);
            firstPlayer.setFinalBlows(firstStats[5]);
            firstPlayer.setTimePlayed(firstStats[6]);

            const secondStats = await PlayerManager.updateStats(secondPlayer);
            secondPlayer.setEliminations(secondStats[0]);
            secondPlayer.setDeaths(secondStats[1]);
            secondPlayer.setHeroDamage(secondStats[2]);
            secondPlayer.setHealing(secondStats[3]);
            secondPlayer.setUltimates(secondStats[4]);
            secondPlayer.setFinalBlows(secondStats[5]);
            secondPlayer.setTimePlayed(secondStats[6]);

            embed.setTitle(`${firstEmoji} ${firstPlayer.givenName} '**${firstPlayer.name}**' ${firstPlayer.familyName} vs ${secondPlayer.givenName} '**${secondPlayer.name}**' ${secondPlayer.familyName} ${secondEmoji}`);
            let firstInfo = [], secondInfo = [];

            firstInfo.push(`${MessageUtil.getFlag(firstPlayer.nationality)} ${firstPlayer.homeLocation}`);
            secondInfo.push(`${MessageUtil.getFlag(secondPlayer.nationality)} ${secondPlayer.homeLocation}`);

            firstInfo.push(`Role: ${Emojis[firstPlayer.role.toUpperCase()]} **${MessageUtil.capitalize(firstPlayer.role)}**`);
            secondInfo.push(`Role: ${Emojis[secondPlayer.role.toUpperCase()]} **${MessageUtil.capitalize(secondPlayer.role)}**`);

            firstInfo.push(`Time Played: **${NumberUtil.toTimeString(firstPlayer.timePlayed)}**`);
            secondInfo.push(`Time Played: **${NumberUtil.toTimeString(secondPlayer.timePlayed)}**`);

            firstInfo.push(`Eliminations: **${firstPlayer.eliminations.toFixed(2)}**`);
            secondInfo.push(`Eliminations: **${secondPlayer.eliminations.toFixed(2)}**`);

            firstInfo.push(`Deaths: **${firstPlayer.deaths.toFixed(2)}**`);
            secondInfo.push(`Deaths: **${secondPlayer.deaths.toFixed(2)}**`);

            firstInfo.push(`Hero Damage: **${firstPlayer.heroDamage.toFixed(2)}**`);
            secondInfo.push(`Hero Damage: **${secondPlayer.heroDamage.toFixed(2)}**`);

            firstInfo.push(`Healing: **${firstPlayer.healing.toFixed(2)}**`);
            secondInfo.push(`Healing: **${secondPlayer.healing.toFixed(2)}**`);

            firstInfo.push(`Ultimates Earned: **${firstPlayer.ultimates.toFixed(2)}**`);
            secondInfo.push(`Ultimates Earned: **${secondPlayer.ultimates.toFixed(2)}**`);
            
            firstInfo.push(`Final Blows: **${firstPlayer.finalBlows.toFixed(2)}**`);
            secondInfo.push(`Final Blows: **${secondPlayer.finalBlows.toFixed(2)}**`);

            embed.addFields(`__${MessageUtil.capitalize(firstPlayer.name)}'s Info__`, firstInfo, true);
            embed.addFields(`__${MessageUtil.capitalize(secondPlayer.name)}'s Info__`, secondInfo, true);

            embed.setFooter('Stats are per 10 minutes, except for Time Played.');
            embed.buildEmbed();
            return { embed: embed.getEmbed };
        }
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

    getHeroUltimate(val) {
        const key = val.toLowerCase();
        for (let i = 0; i < heroes.length; i++) {
            if (heroes[i].key === key) {
                return heroes[i].ultimate;
            }
        }
    }
}
module.exports = CompareCommand;