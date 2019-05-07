'use strict';

const { Command, PachimariEmbed } = require('../../../models');
const { CompetitorManager, PlayerManager, HeroManager } = require('../../../models/owl_models');
const { NumberUtil, MessageUtil, AlertUtil, Logger } = require('../../../utils');
const { Emojis } = require('../../../constants');
let heroUlt;

/**
 * @class PlayerCommand
 * @description represents a command retrieving information about
 * a specific Overwatch League Player
 */
class PlayerCommand extends Command {
    /**
    * Instantiates a new Playerommand
    * @constructor
    */
    constructor() {
        super();
        this.name = 'player';
        this.description = 'Displays information about a specific OWL player';
        this.usage = 'player <player> [accounts|heroes] [expand], !player <player> hero <heroname>'
        this.aliases = [];
    }

    async execute(client, message, args) {
        let loading = message.channel.send(Emojis["LOADING"]);

        if (args.length <= 0) {
            loading.then(message => message.delete());
            MessageUtil.sendError(message.channel, "Please specify an Overwatch League Player to look up");
            return;
        }

        const locateId = PlayerManager.locatePlayer(args[0]);
        const player = PlayerManager.players.get(locateId);

        if (player === undefined) {
            loading.then(message => message.edit(AlertUtil.ERROR(":C Sorry I could not find that player")));
            return;
        }

        const competitor = CompetitorManager.competitors.get(player.competitorId)
        const embed = new PachimariEmbed(client);
        embed.setColor(competitor.primaryColor);
        embed.setThumbnail(player.headshot);
        const teamEmoji = Emojis[competitor.abbreviatedName];
        const playerStats = await PlayerManager.updateStats(player);
        player.setEliminations(playerStats[0]);
        player.setDeaths(playerStats[1]);
        player.setHeroDamage(playerStats[2]);
        player.setHealing(playerStats[3]);
        player.setUltimates(playerStats[4]);
        player.setFinalBlows(playerStats[5]);
        player.setTimePlayed(playerStats[6]);
        let heroes = await PlayerManager.getHeroes(player);

        // retrieve player data
        if (args[1] === undefined) {
            Logger.custom(`PLAYER_COMMAND`, `Loading player ${player.name}`);
            embed.setTitle(`${player.givenName} '**${player.name}**' ${player.familyName}`);
            let info = [];
            info.push(`${teamEmoji}${Emojis[player.role.toUpperCase()]} **#${player.playerNumber}**`);
            info.push(`${MessageUtil.getFlag(player.nationality)} ${player.homeLocation}`);
            embed.setDescription(info);
            if (player.heroes.length !== 0) {
                embed.addFields('Top Heroes', `${player.heroes.join(', ')}`, true);
            }
            embed.addFields('Time Played', NumberUtil.toTimeString(player.timePlayed), true);
            embed.addFields('Eliminations', player.eliminations.toFixed(2), true);
            embed.addFields('Deaths', player.deaths.toFixed(2), true);
            embed.addFields('Hero Damage', player.heroDamage.toFixed(2), true);
            embed.addFields('Healing', player.healing.toFixed(2), true);
            embed.addFields('Ultimates Earned', player.ultimates.toFixed(2), true);
            embed.addFields('Final Blows', player.finalBlows.toFixed(2), true);
            if (player.accounts.size > 0) {
                let word = player.accounts.size > 1 ? 'Accounts' : 'Account';
                embed.addFields(`${player.accounts.size} ${word}`, `\`\`!player ${args[0]} accounts\`\``, true);
            }
            if (heroes.length > 0) {
                let word = heroes.length > 1 ? 'Heroes' : 'Hero';
                embed.addFields(`${heroes.length} Played ${word}`, `\`\`!player ${args[0]} heroes\`\``, true);
            }
            embed.setFooter('Stats are per 10 minutes, except for Time Played.');

            let mess = embed.buildEmbed().getEmbed;
	        loading.then(message => message.edit(mess));
        } else if (args[1].toLowerCase() === 'accounts') {
            Logger.custom(`PLAYER_COMMAND ACCOUNTS`, `Loading ACCOUNTS for player ${player.name}`);

            // return if there are no accounts to be displayed
            if (player.accounts.size === 0) {
                loading.then(message => message.edit(AlertUtil.ERROR("This player does not have any accounts.")));
                return;
            }
            embed.setTitle(`${teamEmoji} ${player.givenName} '**${player.name}**' ${player.familyName}'s Accounts`);

            let accs = [];
            player.accounts.forEach(account => {
                const accountEmoji = Emojis[account.type.toUpperCase()];
                accs.push(`${accountEmoji} [${account.type}](${account.url})`);
            });
            let msg = accs.join('\n');
            embed.setDescription(msg);
            let mess = embed.buildEmbed().getEmbed;
	        loading.then(message => message.edit(mess));
        } else if (args[1].toLowerCase() === 'heroes') {
            Logger.custom(`PLAYER_COMMAND HEROES`, `Loading HEROES for player ${player.name}`);
            // return if there aren't any hero stats
            if (heroes.length === 0) {
                loading.then(message => message.edit(AlertUtil.ERROR("This player doesn't have a list of heroes.")));
                return;
            }
            if (args[2] === undefined) {
                embed.setTitle(`${teamEmoji} ${player.givenName} '**${player.name}**' ${player.familyName}'s Played Heroes`);
                let info = [], percentage = [];
                heroes.sort((a, b) => b.stats.time_played_total - a.stats.time_played_total).forEach(hero => {
                    let heroName = HeroManager.locateHero(hero.name);
                    info.push(`${Emojis[hero.name.replace('-', '').toUpperCase()]} ${HeroManager.getHeroTitle(heroName)}`);
                    percentage.push(`\`${((hero.stats.time_played_total / player.timePlayed) * 100).toFixed(1)}%\`${Emojis["TRANSPARENT"]}`);
                })

                embed.addFields("Heroes", info, true);
                embed.addFields("% Played", percentage, true);

                embed.setFooter("Use \`!player <name> heroes expand\` to see more hero stats!");
                let mess = embed.buildEmbed().getEmbed;
                loading.then(message => message.edit(mess));
            } else if (args[2].toLowerCase() === 'expand') {
                let pages = [], titles = [];
                let page = 1, title = 1;
                Logger.custom(`PLAYER_COMMAND EXPAND HEROES`, `Expanding heroes for player ${player.name}`);
                heroes.sort((a, b) => b.stats.time_played_total - a.stats.time_played_total).forEach(hero => {
                    let info = [];
                    let heroMoji = Emojis[hero.name.replace('-', '').toUpperCase()];
                    let heroName = HeroManager.locateHero(hero.name);
                    if (heroName == 'wreckingball') {
                        heroName = 'wrecking-ball';
                    }
                    let titleString = `${teamEmoji}${heroMoji}  ${player.givenName} '**${player.name}**' ${player.familyName}'s **${HeroManager.getHeroTitle(heroName)}** Stats`;

                    info.push(`Time Played:  \`${NumberUtil.toTimeString(hero.stats.time_played_total)}\``);
                    info.push(`Eliminations:  \`${hero.stats.eliminations_avg_per_10m.toFixed(2)}\``);
                    info.push(`Deaths:  \`${hero.stats.deaths_avg_per_10m.toFixed(2)}\``);
                    info.push(`Hero Damage:  \`${hero.stats.hero_damage_avg_per_10m.toFixed(2)}\``);
                    info.push(`Healing:  \`${hero.stats.healing_avg_per_10m.toFixed(2)}\``);
                    info.push(`${HeroManager.getHeroUltimate(heroName)}s Earned:  \`${hero.stats.ultimates_earned_avg_per_10m.toFixed(2)}\``);
                    info.push(`Final Blows:  \`${hero.stats.final_blows_avg_per_10m.toFixed(2)}\``);

                    titles.push(titleString);
                    pages.push(info);
                })
                embed.setTitle(titles[title - 1]);
                embed.setDescription(pages[page - 1]);

                if (pages.length > 1) {
                    embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages.`);

                    let mess = embed.buildEmbed().getEmbed;
                    loading.then(message => message.edit(mess)).then(msg => {
                        msg.react("⬅").then(r => {
                            msg.react("➡");

                            const backwardsFilter = (reaction, user) => reaction.emoji.name === "⬅" && user.id === message.author.id;
                            const forwardFilter = (reaction, user) => reaction.emoji.name === "➡" && user.id === message.author.id;

                            const backwards = msg.createReactionCollector(backwardsFilter);
                            const forwards = msg.createReactionCollector(forwardFilter); // { time: 100000 }

                            backwards.on('collect', async r => {
                                if (page === 1) {
                                    await r.remove(message.author.id);
                                    return;
                                }
                                page--;
                                title--;
                                embed.setTitle(titles[title - 1]);
                                embed.setDescription(pages[page - 1]);

                                embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages.`);

                                await r.remove(message.author.id);
                                msg.edit(embed.buildEmbed().getEmbed);
                            })

                            forwards.on('collect', async r => {
                                if (page === pages.length) {
                                    r.remove(message.author.id);
                                    return;
                                }
                                page++;
                                title++;
                                embed.setTitle(titles[title - 1]);
                                embed.setDescription(pages[page - 1]);
                                embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages.`);

                                await r.remove(message.author.id);
                                msg.edit(embed.buildEmbed().getEmbed);
                            });
                        })
                    })
                } else {
                    let heroName = HeroManager.locateHero(heroes[0].name);
                    embed.setTitle(titles[title - 1]);
                    embed.setDescription('');
                    embed.addFields(`Time Played`, `${NumberUtil.toTimeString(heroes[0].stats.time_played_total)}`, true);
                    embed.addFields(`Eliminations`, `${heroes[0].stats.eliminations_avg_per_10m.toFixed(2)}`, true);
                    embed.addFields(`Deaths`, `${heroes[0].stats.deaths_avg_per_10m.toFixed(2)}`, true);
                    embed.addFields(`Hero Damage`, `${heroes[0].stats.hero_damage_avg_per_10m.toFixed(2)}`, true);
                    embed.addFields(`Healing`, `${heroes[0].stats.healing_avg_per_10m.toFixed(2)}`, true);
                    embed.addFields(`${HeroManager.getHeroUltimate(heroName)}s Earned`, `${heroes[0].stats.ultimates_earned_avg_per_10m.toFixed(2)}`, true);
                    embed.addFields(`Final Blows`, `${heroes[0].stats.final_blows_avg_per_10m.toFixed(2)}`, true);

                    let mess = embed.buildEmbed().getEmbed;
                    loading.then(message => message.edit(mess));
                }
            } else {
                loading.then(message => message.delete());
                MessageUtil.sendError(message.channel, "Make sure to use the command format \`!player <name> [heroes] [expand]\` for some cool results!");
                return;
            }
        } else if (args[1].toLowerCase() === 'hero') {
            Logger.custom(`PLAYER_COMMAND HERO`, `Loading HERO for player ${player.name}`);
            let hero, heroName;
            if (args[2] === undefined) {
                loading.then(message => message.edit(AlertUtil.ERROR(":C Make sure to add a proper hero name! (no spaces)")));
                return;
            } else if (HeroManager.locateHero(args[2]) === undefined) {
                loading.then(message => message.edit(AlertUtil.ERROR(":C Make sure to add a proper hero name! (no spaces)")));
                return;
            } else {
                hero = HeroManager.locateHero(args[2]);
                heroName = hero;
                if (heroName == 'wrecking-ball') {
                    heroName = 'wreckingball'
                }
            }

            let index = -1;
            let heroMoji = Emojis[hero.replace('-', '').toUpperCase()];
            for (let i = 0; i < heroes.length; i++) {
                if (heroes[i].name == heroName) {
                    index = i;
                    break;
                }
            }
            if (index == -1) {
                loading.then(message => message.delete());
                MessageUtil.sendSuccess(message.channel, `${player.name} hasn\'t played that hero yet! Hopefully soon :)`);
                return;
            } else {
                embed.addFields(`Time Played`, `${NumberUtil.toTimeString(heroes[index].stats.time_played_total)}`, true);
                embed.addFields(`Eliminations`, `${heroes[index].stats.eliminations_avg_per_10m.toFixed(2)}`, true);
                embed.addFields(`Deaths`, `${heroes[index].stats.deaths_avg_per_10m.toFixed(2)}`, true);
                embed.addFields(`Hero Damage`, `${heroes[index].stats.hero_damage_avg_per_10m.toFixed(2)}`, true);
                embed.addFields(`Healing`, `${heroes[index].stats.healing_avg_per_10m.toFixed(2)}`, true);
                embed.addFields(`${HeroManager.getHeroUltimate(hero)}s Earned`, `${heroes[index].stats.ultimates_earned_avg_per_10m.toFixed(2)}`, true);
                embed.addFields(`Final Blows`, `${heroes[index].stats.final_blows_avg_per_10m.toFixed(2)}`, true);
            }

            embed.setTitle(`${teamEmoji}${heroMoji} ${player.givenName} '**${player.name}**' ${player.familyName}'s **${PlayerManager.getHeroTitle(heroes[index])}** Stats`);
            embed.setFooter('Stats are per 10 minutes, except for Time Played.');
            let mess = embed.buildEmbed().getEmbed;
	        loading.then(message => message.edit(mess));

        } else if (args[1] !== undefined) {
            loading.then(message => message.edit(AlertUtil.ERROR("Make sure to use the command format \`!player <name> [heroes] [expand]\` or \`!player <name> [hero] <heroname>\` for some cool results!")));
            return;
        }
    }
}
module.exports = PlayerCommand;