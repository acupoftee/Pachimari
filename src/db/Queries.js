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
}
module.exports = Queries;

