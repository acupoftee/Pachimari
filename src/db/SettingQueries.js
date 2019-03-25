'use strict';

const Database = require('./Database');

module.exports = {
   /**
    * Updates the overwatch announcement boolean 
    * for a specific server
    * @param {number} id 
    * @param {string} announce 
    */
    ANNOUNCE_OWL: function(id, announce) {
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
   },

   /**
     * Updates the command prefix for a specific server
     * @param {number} id 
     * @param {string} commandPrefix 
     */
    PREFIX: function(id, commandPrefix) {
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
    },

    /**
     * Updates the overwatch announcement channel
     * for a specific server
     * @param {number} id 
     * @param {string} channel 
     */
    ANNOUNCE_OWL_CHANNEL: function(id, channel) {
        return new Promise(function(resolve, reject) {
            Database.connection.query(
                `UPDATE guilds
                 SET announce_owl_channel='${channel}'
                 WHERE server_id=${id}`,
                function(err, rows) {
                    if (err) {
                        return Logger.error(`[SQL] Could not UPDATE ${channel} into GUILD ${id}`);
                    }
                    Logger.success(`[SQL] UPDATE ${channel} into GUILD ${id} successful`);
                }
            );
        });
    }
}