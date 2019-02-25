'use strict';

const { Command, PachimariEmbed } = require('../models');
const { CompetitorManager, Endpoints } = require('../owl_models');
const { EmojiUtil, JsonUtil } = require('../utils');

/**
 * @class StandingsCommand
 * @description represents a command that lists all Competitors
 * Standings in the Overwatch League
 */
class StandingsCommand extends Command {
    /**
     * Instantiates a new StandingsCommand
     * @constructor
     */
    constructor() {
        super();
        this.name = 'standings';
        this.description = 'Displays the current standings for this season';
        this.usage = 'standings';
        this.aliases = [];
    }
    
    async execute(client, message, args) {
        let info = [];
        const embed = new PachimariEmbed(client);
        embed.setTitle("__Overwatch League Standings__");
        
        const body = await JsonUtil.parse(Endpoints.get('STANDINGS'));
        let promise = new Promise(function(resolve, reject){
            for (let i = 0; i < CompetitorManager.competitors.size; i++) {
                const standing = body.ranks.content[i];
                //const comp = CompetitorManager.locateTeam(standing.competitor.name);
                const comp = CompetitorManager.competitors[i];
                //const division = comp.divisionId == 79 ? "ATL" : "PAC";
                const matchWin = standing.records[0].matchWin;
                const matchLoss = standing.records[0].matchLoss;
                let mapDiff = standing.records[0].comparisons[1].value;
                if (mapDiff >= 0) {
                    mapDiff = '+' + mapDiff;
                }
                const teamEmoji = EmojiUtil.getEmoji(client, standing.competitor.abbreviatedName);
                // info.push(`\`${('0' + standing.placement).slice(-2)}.\`  ${teamEmoji} **${
                //     standing.competitor.abbreviatedName}**   \`${matchWin}-${matchLoss}\t ${mapDiff}\``);
                const numberData = `${matchWin} - ${matchLoss}    ${mapDiff}`
                // info.push(`\`${('0' + standing.placement).slice(-2)}.\`  ${teamEmoji} ${
                //     standing.competitor.name}` + numberData.padStart(20, '\t'));
                info.push(`\`${('0' + standing.placement).slice(-2)}.\`  ${teamEmoji} \`${numberData}\``);
                //info.push(`${NumberUtil.ordinal(standing.placement).padstart(4)}  ${teamEmoji}  \`${numberData}\``)
            }
            resolve(1);
        });

        promise.then(function(result) {
            embed.setDescription(info);
            embed.setThumbnail("https://image.redbull.com/rbcom/010/2016-11-07/1331828036498_2/0010/1/1500/1000/1/the-overwatch-league-logo-is-an-instant-classic.png");
            embed.buildEmbed().post(message.channel);
        });

        promise.catch(function(err) {
            Logger.error(err.stack);
        })
    }
}
module.exports = StandingsCommand;