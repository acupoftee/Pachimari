require("dotenv").config();
const { Logger, JsonUtil, MessageUtil } = require('../utils');
const { PachimariClient } = require('../models');
const Queries = require('../db/Queries');

const onlineChannels = new Set();

class Twitch {
    /**
     * Instantiates a new Twitch object listening for OWL streams
     * @constructor
     * @param {PachimariClient} client a bot client
     */
    constructor(client) {
        this.client = client;
    }
    async watch() {
        setInterval(async () => {
            let channelName = "overwatchleague";
            let announceOwl = await Queries.getOwlAnnounceChannels();
            const body = await JsonUtil.parse(`https://api.twitch.tv/kraken/streams/${channelName}`,
                {
                    "Client-ID": process.env.TWITCH_CLIENT
                });

            if (!body.stream) {
                if (onlineChannels.has(channelName)) {
                    onlineChannels.delete(channelName);
                    return;
                }
            } else {
                if (!onlineChannels.has(channelName)) {
                    onlineChannels.add(channelName);
                    Logger.success(`${channelName} is live!`);
                    if (announceOwl.length > 0)
                    for (let i = 0; i < announceOwl.length; i++) {
                        MessageUtil.sendLive(this.client.channels.get(announceOwl[i].announce_owl_channel), `${channelName} is live!`);
                    }
                    return;
                }
            }
        }, 5000);
    }
}
module.exports = Twitch;