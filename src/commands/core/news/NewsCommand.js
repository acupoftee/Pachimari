'use strict';

const { Command, PachimariEmbed } = require('../../../models');
const { Article, Endpoints } = require('../../../models/owl_models');
const { JsonUtil, Logger } = require('../../../utils');
const { Emojis } = require('../../../constants');
const moment_timezone = require('moment-timezone');

/**
 * @class NewsCommand
 * @description represents an Embed object with OWL news data
 */
class NewsCommand extends Command {
    /**
     * Instantiates a new NewsCommand
     * @constructor
     */
    constructor() {
        super();
        this.name = 'news';
        this.description = 'Displays recent Overwatch League news.';
        this.usage = 'news';
        this.aliases = ['articles', 'blogs', 'blogposts', 'blog'];
    }

    async execute(client, message, args) {
        Logger.custom(`NEWS_COMMAND`, `Loading news`);
        let msg = message.channel.send(Emojis["LOADING"]);
        msg.then(async message => message.edit(await(this.buildMessage(client))));
    }

    async buildMessage(client) {
        let articles = [];
        const embed = new PachimariEmbed(client);
        embed.setTitle(":newspaper: __Recent Overwatch League News__");

        const body = await JsonUtil.parse(Endpoints.get('NEWS'));
        let promise = new Promise(function(resolve, reject) {
            body.blogs.forEach(blog => {
                let article = new Article(blog.blodId, blog.publish, blog.title,
                    blog.author, blog.summary, blog.defaultUrl);
                articles.push(article);
            });
            resolve(1);
        });
        promise.catch(function(err) {
            Logger.error(err.stack);
        });

        articles.forEach(article => {
            let date = new Date(article.publish);
            embed.addFields(article.title, `[${article.summary}](${article.defaultUrl})\n${date.toDateString()}, ${
                moment_timezone(date).startOf('hour').fromNow()}`);
        });

        embed.buildEmbed();
        return { embed: embed.getEmbed };
    }
}
module.exports = NewsCommand;
