'use strict';

const { Command, PachimariEmbed } = require('../models');
const { Article, Endpoints } = require('../owl_models');
const { JsonUtil } = require('../utils');

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
        embed.setTitle("Recent News");

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
            });
        });

        promise.then(function(result) {
            embed.setThumbnail("https://image.redbull.com/rbcom/010/2016-11-07/1331828036498_2/0010/1/1500/1000/1/the-overwatch-league-logo-is-an-instant-classic.png");
            embed.buildEmbed().post(message.channel);
        });

        promise.catch(function(err) {
            Logger.error(err.stack);
        });
    }
}
module.exports = NewsCommand;
