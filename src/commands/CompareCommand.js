'use strict';

const { Command, PachimariEmbed } = require('../models');
const { CompetitorManager, Banner,  PlayerManager} = require('../models/owl_models');
const { JsonUtil, MessageUtil, NumberUtil } = require('../utils');
const { Emojis } = require('../constants');

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

        if (args.length <= 1 || args.length >= 3) {
            loading.then(message => message.delete());
            MessageUtil.sendError(message.channel, "Please specify 2 Overwatch League Player to compare stats");
            return;
        }
        const firstId = PlayerManager.locatePlayer(args[0]), 
              secondId = PlayerManager.locatePlayer(args[1]);
        const firstPlayer = PlayerManager.players.get(firstId), 
              secondPlayer = PlayerManager.players.get(secondId);

        if (firstPlayer === undefined || secondPlayer === undefined) {
            loading.then(message => message.delete());
            MessageUtil.sendError(message.channel, "Sorry, couldn't find any info :C");
            return;
        }

        const embed = new PachimariEmbed(client);
        const firstCompetitor = CompetitorManager.competitors.get(firstPlayer.competitorId), 
              secondCompetitor = CompetitorManager.competitors.get(secondPlayer.competitorId);
        const firstEmoji = Emojis[firstCompetitor.abbreviatedName], 
              secondEmoji = Emojis[secondCompetitor.abbreviatedName];

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
        firstInfo.push(`${MessageUtil.getFlag(secondPlayer.nationality)} ${secondPlayer.homeLocation}`);

        firstInfo.push(`Role: ${Emojis[firstPlayer.role.toUpperCase()]} **${MessageUtil.capitalize(firstPlayer.role)}**`);
        secondInfo.push(`Role: ${Emojis[secondPlayer.role.toUpperCase()]} **${MessageUtil.capitalize(secondPlayer.role)}**`);

        firstInfo.push(`Time Played: **${NumberUtil.toTimeString(firstPlayer.timePlayed)}**`);
        secondInfo.push(`Time Played: **${NumberUtil.toTimeString(secondPlayer.timePlayed)}**`);

        firstInfo.push(`Eliminations: **${firstPlayer.timePlayed.toFixed(2)}**`);
        secondInfo.push(`Eliminations: **${secondPlayer.timePlayed.toFixed(2)}**`);

        firstInfo.push(`Deaths: **${firstPlayer.deaths.toFixed(2)}**`);
        secondInfo.push(`Deaths: **${secondPlayer.deaths.toFixed(2)}**`);

        firstInfo.push(`Hero Damage: **${firstPlayer.heroDamage.toFixed(2)}**`);
        secondInfo.push(`Hero Damage: **${secondPlayer.heroDamage.toFixed(2)}**`);

        firstInfo.push(`Healing: **${firstPlayer.healing.toFixed(2)}**`);
        secondInfo.push(`Healing: **${secondPlayer.healing.toFixed(2)}**`);

        firstInfo.push(`Ultimates Earned: **${firstPlayer.ultimates.toFixed(2)}**`);
        secondInfo.push(`Ultimates Earned: **${secondPlayer.ultimates.toFixed(2)}**`);
        
        firstInfo.push(`Final Blows: **${firstPlayer.timePlayed.toFixed(2)}**`);
        secondInfo.push(`Final Blows: **${secondPlayer.timePlayed.toFixed(2)}**`);

        embed.addFields(`__${firstPlayer.name}'s Info__`, firstInfo, true);
        embed.addFields(`__${MessageUtil.getFlag(secondPlayer.nationality)} ${secondPlayer.name}'s Info__`, secondInfo, true);

        embed.setFooter('Stats are per 10 minutes, except for Time Played.');
        embed.buildEmbed();
        loading.then(message => message.delete());
        embed.post(message.channel);
    }
}
module.exports = CompareCommand;