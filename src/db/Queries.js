'use strict';

const Database = require('./Database');
const { Logger } = require('../utils');

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
    
    /**
     * Adds a user's prediction in the database
     * @param {string} guild_id 
     * @param {string} user 
     * @param {string} first_team 
     * @param {number} first_score 
     * @param {string} second_team 
     * @param {number} second_score 
     */
    static addPredictions(guild_id, user, first_team, first_score, second_team, second_score) {
        return new Promise(function(resolve, reject) {
            Database.connection.query(
                `INSERT INTO predictions (server_id, user_id, first_team, first_score, second_team, second_score) VALUES (${
                    guild_id}, ${user}, "${first_team}", ${first_score}, "${second_team}", ${second_score})`,
                function(err, rows) {
                    if (err) {
                        return Logger.error(`[SQL] Could not INSERT into PREDICTIONS ${
                            guild_id}, ${user}, ${first_team}, ${first_score}, ${second_team}, ${second_score}\n${
                                err.stack}`);
                    }
                    Logger.success(`[SQL] INSERT into PREDICTIONS ${
                        guild_id}, ${user}, ${first_team}, ${first_score}, ${second_team}, ${second_score} successful`);
                }
            );
        });
    }
}
module.exports = Queries;

