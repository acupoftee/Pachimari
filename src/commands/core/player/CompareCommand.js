'use strict';

const { Command, PachimariEmbed } = require('../../../models');
const { CompetitorManager, PlayerManager, HeroManager } = require('../../../models/owl_models');
const { MessageUtil, AlertUtil, NumberUtil, Logger } = require('../../../utils');
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
        } else if (args[2] !== undefined && HeroManager.locateHero(args[2]) === undefined) {
            return AlertUtil.ERROR(":C Sorry I couldn't find that hero. Maybe a typo?")
        }

        const firstId = PlayerManager.locatePlayer(args[0]), 
              secondId = PlayerManager.locatePlayer(args[1]);
        const firstPlayer = PlayerManager.players.get(firstId), 
              secondPlayer = PlayerManager.players.get(secondId);


        if (firstPlayer === undefined || secondPlayer === undefined) {
            return AlertUtil.ERROR("Sorry, couldn't find any info for those players :C");
        }

        const embed = new PachimariEmbed(client);
        const firstCompetitor = CompetitorManager.competitors.get(firstPlayer.competitorId), 
              secondCompetitor = CompetitorManager.competitors.get(secondPlayer.competitorId);
        const firstEmoji = Emojis[firstCompetitor.abbreviatedName], 
              secondEmoji = Emojis[secondCompetitor.abbreviatedName];

        if (args.length === 3) {
            Logger.custom(`COMPARE_COMMAND HERO`, `Comparing ${firstPlayer.name} and ${secondPlayer.name} on ${args[2]}`);
            let heroURL, heroTitle, heroColor, heroUlt;
            let firstPlayerHeroes = await PlayerManager.getHeroes(firstPlayer),
                secondPlayerHeroes = await PlayerManager.getHeroes(secondPlayer);
            let firstIndex = -1, secondIndex = -1;
 
            let heroAlias = HeroManager.locateHero(args[2]);
            let heroName = heroAlias;
            if (heroAlias == 'wrecking-ball') {
                heroName = 'wreckingball';
            }
            heroColor = HeroManager.getHeroColor(heroAlias);
            heroURL = HeroManager.getHeroURL(heroAlias);
            heroTitle = HeroManager.getHeroTitle(heroAlias);
            heroUlt = HeroManager.getHeroUltimate(heroAlias);

            for (let i = 0; i < firstPlayerHeroes.length; i++) {
                if (firstPlayerHeroes[i].name == heroName) {
                    firstIndex = i;
                    break;
                }
            }

            for (let i = 0; i < secondPlayerHeroes.length; i++) {
                if (secondPlayerHeroes[i].name == heroName) {
                    secondIndex = i;
                    break;
                }
            }
            // potential portrait url https://d1u1mce87gyfbn.cloudfront.net/hero/ana/icon-portrait.png
            embed.setTitle(`${firstEmoji} ${firstPlayer.givenName} '**${firstPlayer.name}**' ${firstPlayer.familyName} vs ${secondPlayer.givenName} '**${secondPlayer.name}**' ${secondPlayer.familyName} ${secondEmoji}\n on **${heroTitle}**`);
            Logger.custom(`COMPARE_COMMAND HERO`, `Comparing ${firstPlayer.name} and ${secondPlayer.name} on ${heroTitle}`);
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
            Logger.custom(`COMPARE_COMMAND`, `Comparing ${firstPlayer.name} and ${secondPlayer.name}`);
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
}
module.exports = CompareCommand;