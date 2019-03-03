'use strict';

const { JsonUtil, MessageUtil } = require('../../utils');
const Endpoints = require('./Endpoints');

/**
 * @class Map
 * @description locates Overwatch Maps
 */
class OverwatchMap {

    /**
     * Finds the name of a map by ID
     * @param {string} guid the Map GUID
     * @param {string} locale the map language
     */
    static async getMap(guid, locale='en_US') {
        const body = await JsonUtil.parse(Endpoints.get("MAPS"));
        return new Promise((resolve, reject) => {
            body.forEach(map => {
                if (map.guid == guid) {
                    resolve(MessageUtil.capitalizeSentence(`map.name.${locale}`));
                }
            });
            reject(null);
        });
    }

    /**
     * Finds the type of map by ID
     * @param {string} guid the Map GUID
     */
    static async getMapType(guid) {
        const body = await JsonUtil.parse(Endpoints.get("MAPS"));
        return new Promise((resolve, reject) => {
            body.forEach(map => {
                if (map.guid == guid) {
                    resolve(MessageUtil.capitalize(map.type));
                }
            });
            reject(null);
        })
    }
}
module.exports = OverwatchMap;