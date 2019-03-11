'use strict';

const { Command, PachimariEmbed } = require('../models');
const { CompetitorManager, Endpoints } = require('../models/owl_models');
const { JsonUtil } = require('../utils');
const { Emojis } = require('../constants');

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
        this.usage = 'standings [playoffs]';
        this.aliases = [];
    }
    
    async execute(client, message, args) {
        let msg = message.channel.send(Emojis["LOADING"]);
        msg.then(async message => message.edit(await(this.buildMessage(client, args))));
    }

    async buildMessage(client, args) {
        let info = [];
        const embed = new PachimariEmbed(client);
        embed.setTitle("__Overwatch League Standings__");
        
        const body = await JsonUtil.parse(Endpoints.get('STANDINGS'));
        let promise = new Promise(function(resolve, reject){
            for (let i = 0; i < CompetitorManager.competitors.size; i++) {
                const standing = body.ranks.content[i];
                const matchWin = standing.records[0].matchWin;
                const matchLoss = standing.records[0].matchLoss;
                let mapDiff = standing.records[0].comparisons[1].value;
                if (mapDiff >= 0) {
                    mapDiff = '+' + mapDiff;
                }
                const teamEmoji = Emojis[standing.competitor.abbreviatedName];
                const numberData = `${matchWin}W - ${matchLoss}L  ${mapDiff}`
                info.push(`\`${('0' + standing.placement).slice(-2)}.\`  ${teamEmoji} \`${numberData}\``);
            }
            resolve(1);
        });
        promise.catch(function(err) {
            Logger.error(err.stack);
        });

        if (args[0] !== undefined && args[0].toLowerCase() === 'playoffs') {
            info.splice(0, 0, '***Division Leaders***');
            info.splice(3, 0, '\n***Other Teams***');
            info.splice(8, 0, '\n***Postsason Playoffs Cutoff***');
        } else {
            info.splice(8, 0, `--------------------------\n\*Stage Playoffs Cutoff*\n--------------------------`);
        }
        embed.setDescription(info);
        embed.buildEmbed();
        return {embed : embed.getEmbed}
    }
}
module.exports = StandingsCommand;