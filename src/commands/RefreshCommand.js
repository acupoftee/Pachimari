const { Command, PachimariEmbed } = require('../models');
const { StandingsManager } = require('../models/owl_models');


class RefreshCommand extends Command {
    constructor() {
        super();
        this.name = 'refresh';
        this.description = 'test page';
        this.usage = 'page';
        this.aliases = [];
    }

    async execute(client, message, args) {
        let pages = ["This is the first page", "This is the second", "third", "fourth", "i can do this!"];
        let page = 1;
        let embed = new PachimariEmbed(client);
        let list = new StandingsManager();
        list.loadStandings(client);
        embed.setTitle("Page Test");
        embed.setDescription(list.loadStandings().info);
        let mess = embed.buildEmbed().getEmbed;

        message.channel.send(mess).then(msg => {
            msg.react("🔄").then(r => {

                const backwardsFilter = (reaction, user) => reaction.emoji.name === "🔄" && user.id === message.author.id;

                const refresh = msg.createReactionCollector(backwardsFilter, { time: 60000 });

                refresh.on('collect', r => {
                    list.loadStandings(client);
                    embed.setDescription("Refreshing..."); 
                    embed.setDescription(list.loadStandings().info);
                    msg.edit(embed.buildEmbed().getEmbed);
                })
            })
        });

    }
}
module.exports = RefreshCommand;