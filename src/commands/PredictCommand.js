const { Command, Prediction } = require('../models');
const { JsonUtil, MessageUtil, Logger } = require('../utils');
const { CompetitorManager, Endpoints } = require('../models/owl_models');
const { Emojis } = require('../constants');
const Queries = require('../db/Queries');
const stageData = require('../data/stages.json');

let stageWeek = "", matchStatus = "";
let matchId = 0;

class PredictCommand extends Command {
    constructor() {
        super();
        this.name = "predict";
        this.description = "allows users to make a prediction";
        this.usage = "predict <first_team> <first_score> <second_team> <second_score>";
        this.aliases = [];
    }

    async execute(client, message, args) {
        if (args.length <= 3 || args.length > 4) {
            MessageUtil.sendError(message.channel, "Please enter two teams and scores into your predictions!");
            return;
        }
        let first = CompetitorManager.competitors.get(CompetitorManager.locateTeam(args[0]));
        let second = CompetitorManager.competitors.get(CompetitorManager.locateTeam(args[2]));

        if (!first || !second) {
            MessageUtil.sendError(message.channel, "Please enter two teams and scores into your predictions!");
            return;
        }

        if ((!Number.isInteger(parseInt(args[1])) || !Number.isInteger(parseInt(args[3]))) || (Number.isInteger(parseInt(args[0])) || Number.isInteger(parseInt(args[2])))) {
            MessageUtil.sendError(message.channel, "Please enter your prediction in this format: \`\`<first_team> <first_score> <second_team> <second_score>\`\` uwu");
            return;
        }
        let scheduleCheck = await this.isInSchedule(args[0], args[2]);
        if (scheduleCheck) {
            let prediction = new Prediction(first.name, args[1], second.name, args[3], matchId, matchStatus);
            let firstEmoji = Emojis[first.abbreviatedName], secondEmoji = Emojis[second.abbreviatedName];
            MessageUtil.sendSuccess(message.channel, `Added prediction for ${stageWeek}:\n\n ${
            firstEmoji} ${prediction.homeTeam} - ${prediction.homeScore}\n ${
                secondEmoji} ${prediction.awayTeam} - ${prediction.awayScore}`);
            await Queries.addPredictions(message.guild.id, 
                    message.author.id, 
                    prediction.homeTeam,
                    prediction.homeScore,
                    prediction.awayTeam,
                    prediction.awayScore,
                    prediction.matchId,
                    prediction.matchStatus);
        } else {
            MessageUtil.sendError(message.channel, `Prediction match isn't in the schedule for ${stageWeek} :C`);
        }
    }

    /**
     * Checks if a competitor is competing during the current week
     * @param {Competitor} firstTeam 
     * @param {Competitor} secondTeam 
     * @returns {boolean}
     */
    async isInSchedule(firstTeam, secondTeam) {
        let inSchedule = false;
        const body = await JsonUtil.parse(Endpoints.get('SCHEDULE'));
        let currentTime = new Date().getTime();
        let slug = null;
        for (let i = 0; i < stageData.length; i++) {
            const stage = stageData[i];
            if (currentTime < stage.endDate) {
                slug = stage.slug;
                break;
            }
        }
        // organize data by stage and week
        for (const _stage of body.data.stages) {
            if (_stage.slug === slug) {
                for (const week of _stage.weeks) {
                    if ((currentTime < week.endDate) || (currentTime > week.startDate && currentTime < week.endDate)) {
                        stageWeek = `${_stage.name}/${week.name}`;
                        for (const _match of week.matches) {
                            let first = CompetitorManager.competitors.get(CompetitorManager.locateTeam(firstTeam));
                            let second = CompetitorManager.competitors.get(CompetitorManager.locateTeam(secondTeam));
                            console.log(first.abbreviatedName, second.abbreviatedName);
                            if ((first.abbreviatedName === _match.competitors[1].abbreviatedName &&
                                second.abbreviatedName === _match.competitors[0].abbreviatedName) ||
                                (first.abbreviatedName === _match.competitors[0].abbreviatedName &&
                                 second.abbreviatedName === _match.competitors[1].abbreviatedName)) {
                                matchId = 
                                inSchedule = true;
                                matchId = _match.id;
                                matchStatus = _match.status;
                                break;
                            } 
                        }
                        break;
                    }
                }
            }
        }
        console.log(inSchedule);
        return inSchedule;
    }
}
module.exports = PredictCommand;