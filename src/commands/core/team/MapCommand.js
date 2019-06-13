'use strict';

const { Command, PachimariEmbed } = require('../../../models');
class MapCommand extends Command {
    constructor() {
        super();
        this.name = "mapstats";
        this.description = "Displays map win rates for a specific OWL team";
        this.usage = "mapstats <team> [mapname]";
        this.aliases = [];
    }
    async execute(client, message, args) {
        
    }

}
module.exports = MapCommand;