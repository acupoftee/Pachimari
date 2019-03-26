'use strict';

const Database = require('./Database');
const { Logger } = require('../utils');
const { TextChannel } = require(
    'discord.js'
)

class Queries {
    /**
     * Adds a guild into the database
     * @param {number} id 
     */
    static addGuild(id) {
        return new Promise(function(resolve, reject) {
            Database.connection.query(
                `INSERT INTO guilds (server_id) VALUES (${id})`,
                function(err, rows) {
                    if (err) {
                        return Logger.error(`[SQL] Could not INSERT into GUILD ${id}`);
                    }
                    Logger.success(`[SQL] INSERT into GUILD ${id} successful`);
                }
            );
        });
    }

    /**
     * Deletes a guild from the database
     * @param {number} id 
     */
    static deleteGuild(id) {
        return new Promise(function(resolve, reject) {
            Database.connection.query(
                `DELETE FROM guilds WHERE server_id = ${id}`,
                function(err, rows) {
                    if (err) {
                        return Logger.error(`[SQL] Could not DELETE from GUILD ${id}`);
                    }
                    Logger.success(`[SQL] DELETE from GUILD ${id} successful`);
                }
            );
        });
    }

    /**
     * Returns a guild's information
     * @param {number} id 
     */
    static getGuild(id) {
        return new Promise(function(resolve, reject) {
            Database.connection.query(
                `SELECT * FROM guilds WHERE server_id = ${id}`,
                function(err, rows) {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows[0]);
                }
            );
        });
    }

    static getOwlAnnounceChannels() {
        return new Promise(function(resolve, reject) {
            Database.connection.query(
                `SELECT * FROM guilds WHERE announce_owl = 'true'`,
                function(err, rows) {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                }
            );
        });
    }
    /**
     * Updates the command prefix for a specific server
     * @param {number} id 
     * @param {string} commandPrefix 
     */
    static updatePrefix(id, commandPrefix) {
        return new Promise(function(resolve, reject) {
            Database.connection.query(
                `UPDATE guilds
                 SET prefix='${commandPrefix}'
                 WHERE server_id=${id}`,
                function(err, rows) {
                    if (err) {
                        return Logger.error(`[SQL] Could not UPDATE ${commandPrefix} into GUILD ${id}`);
                    }
                    Logger.success(`[SQL] UPDATE ${commandPrefix} into GUILD ${id} successful`);
                }
            );
        });
    }

    /**
     * Updates the overwatch announcement boolean 
     * for a specific server
     * @param {number} id 
     * @param {string} announce 
     */
    static updateOwlAnnouncement(id, announce) {
        return new Promise(function(resolve, reject) {
            Database.connection.query(
                `UPDATE guilds
                 SET announce_owl='${announce}'
                 WHERE server_id=${id}`,
                function(err, rows) {
                    if (err) {
                        return Logger.error(`[SQL] Could not UPDATE ${announce} into GUILD ${id}`);
                    }
                    Logger.success(`[SQL] UPDATE ${announce} into GUILD ${id} successful`);
                }
            );
        });
    }

    /**
     * Updates the overwatch announcement channel
     * for a specific server
     * @param {number} id 
     * @param {TextChannel} channel 
     */
    static updateOwlAnnouncementChannel(id, channel) {
        let channelId = channel.replace(/\D/g,'');
        return new Promise(function(resolve, reject) {
            Database.connection.query(
                `UPDATE guilds
                 SET announce_owl_channel='${channelId}'
                 WHERE server_id=${id}`,
                function(err, rows) {
                    if (err) {
                        return Logger.error(`[SQL] Could not UPDATE ${channelId} into GUILD ${id}`);
                    }
                    Logger.success(`[SQL] UPDATE ${channelId} into GUILD ${id} successful`);
                }
            );
        });
    }
    
    /**
     * Adds a user's prediction in the database
     * @param {string} guild_id 
     * @param {string} user 
     * @param {string} first_team 
     * @param {number} first_score 
     * @param {string} second_team 
     * @param {number} second_score 
     * @param {number} match_id
     * @param {string} match_status
     */
    static addPredictions(guild_id, user, first_team, first_score, second_team, second_score, match_id, match_status) {
        return new Promise(function(resolve, reject) {
            Database.connection.query(
                `INSERT INTO predictions (server_id, user_id, first_team, first_score, second_team, second_score, match_id, match_status) VALUES (${
                    guild_id}, ${user}, "${first_team}", ${first_score}, "${second_team}", ${second_score}, ${match_id}, '${match_status}')`,
                function(err, rows) {
                    if (err) {
                        return Logger.error(`[SQL] Could not INSERT into PREDICTIONS ${
                            guild_id}, ${user}, ${first_team}, ${first_score}, ${second_team}, ${second_score}, ${match_id}, ${match_status}\n${
                                err.stack}`);
                    }
                    Logger.success(`[SQL] INSERT into PREDICTIONS ${
                        guild_id}, ${user}, ${first_team}, ${first_score}, ${second_team}, ${second_score}, ${match_id}, ${match_status} successful`);
                }
            );
        });
    }

    /**
     * Returns all user's predictions for the current week
     * @param {number} id user id
     */
    static getPredictions(id) {
        return new Promise(function(resolve, reject) {
            Database.connection.query(
                `SELECT * FROM predictions WHERE user_id = ${id} AND match_status = "PENDING"`,
                function(err, rows) {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                }
            );
        })
    }

    /**
     * Returns an array of distinct matches;
     */
    static getDistinctMatches() {
        return new Promise(function(resolve, reject) {
            Database.connection.query(
                `SELECT DISTINCT match_id FROM predictions`,
                function(err, rows) {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                }
            );
        })
    }   

    /**
     * Deletes predictions with concluded matches from the database
     * @param id match id to delete
     */
    static deletePredictions(id) {
        return new Promise(function(resolve, reject) {
            Database.connection.query(
                `DELETE FROM predictions WHERE match_id=${id}`,
                function(err, rows) {
                    if (err) {
                        return Logger.error(`[SQL] Could not DELETE from PREDICTIONS match_id ${id}`);
                    }
                    Logger.success(`[SQL] DELETE from PREDICTIONS match_id ${id} successful`);
                }
            );
        });
    }
}
module.exports = Queries;

