'use strict';

const { Command, PachimariEmbed } = require('../models');
const { Article, Endpoints } = require('../models/owl_models');
const { JsonUtil } = require('../utils');
const { LeagueLogo } = require('../constants');

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
        let articles = [];
        const embed = new PachimariEmbed(client);
        embed.setTitle("__Recent Overwatch League News__");

        const body = await JsonUtil.parse(Endpoints.get('NEWS'));
        let promise = new Promise(function(resolve, reject) {
            body.blogs.forEach(blog => {
                let article = new Article(blog.blodId, blog.publish, blog.title,
                    blog.author, blog.summary, blog.defaultUrl);
                articles.push(article);
            });
            resolve(1);
        });

        promise.then(function(result) {
            articles.forEach(article => {
                let date = new Date(article.publish);
                embed.addFields(article.title, `[${article.summary}](${article.defaultUrl})\n${date.toDateString()}`);
                //embed.addFields(`__${article.title}__`, `[!np${article.summary}](${article.defaultUrl})\n${date.toDateString()}`);
            });
        });

        promise.then(function(result) {
            embed.setThumbnail(LeagueLogo.URL);
            embed.buildEmbed().post(message.channel);
        });

        promise.catch(function(err) {
            Logger.error(err.stack);
        });
    }
}
module.exports = NewsCommand;
