'use strict';

const request = require('request');
const Logger = require('./Logger');

/**
 * @class JsonUtil
 * @description Utility class for parsing JSON
 */
class JsonUtil {
    constructor() {}
    
    static async parse(uri) {
        return new Promise(function (resolve, reject) {
            request({
                url: uri,
                json: true
            }, function(error, response, body) {
                if (error || response.statusCode !== 200)
                    Logger.error(error);
                resolve(body);
            });
        });
    }
}
module.exports = JsonUtil;