'use strict';
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const { Command, PachimariEmbed } = require('../../../models');
const { PlayerManager, CompetitorManager } = require('../../../models/owl_models')

class HypeCommand extends Command {
    constructor() {
        super();
        this.name = "hype";
        this.description = "Show some hype for your fav team";
        this.usage = "hype <teamname>";
        this.aliases = [];
    }

    async execute(client, message, args) {
        if (args.length === 1) {

        }
    }
}
module.exports = HypeCommand;