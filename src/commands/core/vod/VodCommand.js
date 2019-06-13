const { Command, PachimariEmbed } = require('../../../models');
const { Video, Endpoints } = require('../../../models/owl_models');
const { JsonUtil, Logger } = require('../../../utils');
const { Emojis } = require('../../../constants');
const moment_timezone = require('moment-timezone');

class VodCommand extends Command {
    constructor() {
        super();
        this.name = 'vods';
        this.description = 'Shows Overwatch League vods';
        this.usage = 'vods';
        this.aliases = ['videos'];
    }

    async execute(client, message, args) {
        let loading = message.channel.send(Emojis["LOADING"]);
        let videos = [];
        let pages = [], descriptions = [];  //titles = [], thumbnails = [],
        let page = 1; //title = 1, thumbnail = 1;
        //let counter = 1;
        const embed = new PachimariEmbed(client);

        const body = await JsonUtil.parse(Endpoints.get("VODS"));
        Logger.custom(`VODS_COMMAND`, `Loading recent vods`);
        body.data.forEach(vod => {
            let voddescription = vod.description === null ? '\n\n' : `\n\n"*${vod.description}*"\n\n`
            let video = new Video(vod.unique_id, vod.available_at, vod.title, voddescription,
                `${vod.thumbnail}.jpg`, vod.share_url);
            if (vod.status === 'complete')
                videos.push(video);
        })

        for (const video of videos) {
            let date = moment_timezone(video.date).tz('America/Los_Angeles').format('ddd. MMM Do, YYYY');
            //titles.push(video.title);
            let description = `__**${video.title}**__\nPublished on ${date}${video.description}[Watch here!](${video.shareURL})\n`;
            descriptions.push(description);
            //thumbnails.push(video.thumbnail);
            if (descriptions.length == 3) {
                pages.push(descriptions);
                descriptions = [];
            }
            //counter++;
        }
        pages.push(descriptions);
        embed.setTitle(":tv: __Recent Overwatch League VODs__");
        embed.setDescription(pages[page - 1]);
        embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages`);
        //embed.setImage(thumbnails[thumbnail-1]);

        let mess = embed.buildEmbed().getEmbed;
        //loading.then(message => message.delete());
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
                    //title--;
                    //thumbnail--;
                    //embed.setTitle(titles[title-1]);
                    embed.setDescription(pages[page - 1]);
                    embed.setTitle(":tv: __Recent Overwatch League VODs__");
                    //embed.setImage(thumbnails[thumbnail-1]);
                    embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages`);
                    await r.remove(message.author.id);
                    msg.edit(embed.buildEmbed().getEmbed);
                })

                forwards.on('collect', async r => {
                    if (page === pages.length) {
                        r.remove(message.author.id);
                        return;
                    }
                    page++;
                    //title++;
                    //thumbnail++;
                    //embed.setTitle(titles[title-1]);
                    embed.setTitle(":tv: __Recent Overwatch League VODs__");
                    embed.setDescription(pages[page - 1]);
                    //embed.setImage(thumbnails[thumbnail-1]);
                    embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages`);
                    await r.remove(message.author.id);
                    msg.edit(embed.buildEmbed().getEmbed);
                });
            })
        })
    }
}
module.exports = VodCommand;