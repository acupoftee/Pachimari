'use strict';

const { Command, PachimariEmbed } = require('../models');
const { CompetitorManager, Endpoints } = require('../models/owl_models');
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
                const matchWin = standing.records[0].matchWin;
                const matchLoss = standing.records[0].matchLoss;
                let mapDiff = standing.records[0].comparisons[1].value;
                if (mapDiff >= 0) {
                    mapDiff = '+' + mapDiff;
                }
                const teamEmoji = EmojiUtil.getEmoji(client, standing.competitor.abbreviatedName);
                const numberData = `${matchWin} - ${matchLoss} ${mapDiff}`
                info.push(`\`${('0' + standing.placement).slice(-2)}.\`  ${teamEmoji} \`${numberData}\``);
            }
            resolve(1);
        });

        promise.then(function(result) {
            embed.setDescription(info);
            // message.channel.send(embed.buildEmbed().getEmbed).then(msg => {
            //     msg.react("🔄").then(r => {
    
            //         const backwardsFilter = (reaction, user) => reaction.emoji.name === "🔄" && user.id === message.author.id;
    
            //         const refresh = msg.createReactionCollector(backwardsFilter, { time: 60000 });
    
            //         refresh.on('collect', r => {
            //             info = [];
            //             embed.setDescription("Refreshing..."); 
            //             Promise.all([promise]).then(function(values) {
            //                 info.push(values);
            //             });
            //             embed.setDescription(info);
            //             msg.edit(embed.buildEmbed().getEmbed);
            //         })
            //     })
            // });
            embed.buildEmbed().post(message.channel);
        });

        promise.catch(function(err) {
            Logger.error(err.stack);
        })
    }
}
module.exports = StandingsCommand;