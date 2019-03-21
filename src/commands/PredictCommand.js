const { Command, Prediction } = require('../models');
const { JsonUtil, MessageUtil, Logger } = require('../utils');
const { CompetitorManager, Endpoints } = require('../models/owl_models');
const { Emojis } = require('../constants');
const stageData = require('../data/stages.json');

let stageWeek = "";

class PredictCommand extends Command {
    constructor() {
        super();
        this.name = "predict";
        this.description = "allows users to make a prediction";
        this.usage = "predict <first_team> <first_score> <second_team> <second_score>";
        this.aliases = [];
    }

    async execute(client, message, args) {
        if (args.length <= 3) {
            MessageUtil.sendError(message.channel, "Please enter two teams and scores into your predictions!");
            return;
        }
        let first = CompetitorManager.competitors.get(CompetitorManager.locateTeam(args[0]));
        let second = CompetitorManager.competitors.get(CompetitorManager.locateTeam(args[2]));

        if (!first || !second) {
            MessageUtil.sendError(message.channel, "Please enter two teams and scores into your predictions!");
            return;
        }
        let scheduleCheck = await this.isInSchedule(args[0], args[2]);
        if (scheduleCheck) {
            MessageUtil.sendSuccess(message.channel, `Prediction is in schedule for ${stageWeek}!!`);
        } else {
            MessageUtil.sendError(message.channel, `Prediction match isn't in the schedule for ${stageWeek} :C`);
        }
    }

    /**
     * 
     * @param {*} firstTeam 
     * @param {*} secondTeam 
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
                                inSchedule = true;
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