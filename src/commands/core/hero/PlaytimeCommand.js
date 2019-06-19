const { Collection } = require('discord.js');
const { Command, PachimariEmbed } = require('../../../models');
const { HeroManager, PlayerManager } = require('../../../models/owl_models');
const { Logger, NumberUtil } = require('../../../utils');
const { Emojis } = require('../../../constants');


class PlaytimeCommand extends Command {
    constructor() {
        super();
        this.name = 'heroes';
        this.description = 'Shows each hero\'s playtime';
        this.usage = 'heroes';
        this.aliases = ['heroplaytime'];
    }

    async execute(client, message, args) {
        // 1. loop through all player's played heroes
        // 2. create a dictionary of hero names and playtimes
        // 3. add the playtime to the specific hero
        // 4. sort the map based on playtime
        // 5. display playtimes in an embed 
        Logger.custom(`HERO_PLAYTIMES`, 'Using Heroes Command');
        let loading = message.channel.send(Emojis["LOADING"]);
        let pages = [];
        let page = 1;
        /**
         * A collection of hero names and playtimes
         * @type {Collection<string, number>}
         */
        const playtimes = new Collection();
        const list = PlayerManager.players.array();

        // loop through each player's played heroes
        for (const player of list) {
           for (const hero of player.playedHeroes.array()) {
                let name = hero.name == "wreckingball" ? "wrecking-ball" : hero.name;

                // add the hero to the map if we haven't seen it yet
                if (!playtimes.has(name)) {
                    playtimes.set(name, hero.timePlayed);
                } else {
                    // update the existing playtime
                    let currentPlaytime = playtimes.get(name);
                    let updatedPlaytime = currentPlaytime + hero.timePlayed;
                    playtimes.set(name, updatedPlaytime);
                }
            }
        }
        // creates an array of entries and sorts them by value in descending order
        const sortedPlaytimes = [...playtimes.entries()].sort((a, b) => b[1] - a[1]);
        console.log(sortedPlaytimes)
        let heroPlaytimeDescription = [];
        let counter = 1;

        sortedPlaytimes.forEach(entry => {
            let heroMoji = Emojis[entry[0].replace('-', '').toUpperCase()];
            let heroRole = HeroManager.getHeroRole(entry[0]);
            let roleMoji = Emojis[heroRole.toUpperCase()];
            let heroTitle = HeroManager.getHeroTitle(entry[0]);
            let timePlayed = NumberUtil.toTimeString(entry[1]);
            console.log(`${heroTitle} playtime: ${timePlayed}`)
            let heroString = `\`${String(counter).padStart(2, "0")}\`. ${roleMoji}${heroMoji} **${heroTitle}:** ${timePlayed}`;
            heroPlaytimeDescription.push(heroString);
            if (counter % 10 == 0) {
                pages.push(heroPlaytimeDescription);
                heroPlaytimeDescription = [];
            }
            counter++;
        });

        let embed = new PachimariEmbed(client);
        embed.setTitle(":watch: __Overwatch League Total Hero Playtimes__");
        embed.setDescription(pages[page-1]);
        embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages.`);
    
        let mess = embed.buildEmbed().getEmbed;
        loading.then(message => message.edit(mess)).then(msg => {
            msg.react("⬅").then(r => {
                msg.react("➡");

                const backwardsFilter = (reaction, user) => reaction.emoji.name === "⬅" && user.id === message.author.id;
                const forwardFilter = (reaction, user) => reaction.emoji.name === "➡" && user.id === message.author.id;

                const backwards = msg.createReactionCollector(backwardsFilter, { time: 200000 });
                const forwards = msg.createReactionCollector(forwardFilter, { time: 200000 }); // { time: 100000 }

                backwards.on('collect', async r => {
                    if (page === 1) {
                        await r.remove(message.author.id);
                        return;
                    }
                    page--;
                    embed.setDescription(pages[page - 1]);
                    embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages.`);
                    await r.remove(message.author.id);
                    msg.edit(embed.buildEmbed().getEmbed);
                });

                forwards.on('collect', async r => {
                    if (page === pages.length) {
                        await r.remove(message.author.id);
                        return;
                    }
                    page++;
                    embed.setDescription(pages[page - 1]);
                    embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages.`);
                    await r.remove(message.author.id);
                    msg.edit(embed.buildEmbed().getEmbed);
                });
            });
        });
    }
}
module.exports = PlaytimeCommand;