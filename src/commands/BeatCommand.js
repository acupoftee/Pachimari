'use strict';
const { Command } = require('../models');
const { Emojis } = require('../constants');

class BeatCommand extends Command {
    constructor() {
        super();
        this.name = 'beat';
        this.description = 'Displays friendly taunt';
        this.usage = 'beat <winning-team> <losing-team>';
        this.aliases = [];
    }

    async execute(client, message, args) {
        let mess = `:muscle:${Emojis["BOS"]}:right_facing_fist: ${Emojis["TOR"]}`;
        message.channel.send(mess);
    }
}
module.exports = BeatCommand;