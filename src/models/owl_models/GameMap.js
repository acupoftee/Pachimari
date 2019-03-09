'use strict';

const { JsonUtil, MessageUtil } = require('../../utils');
const Endpoints = require('./Endpoints');

/**
 * @class Map
 * @description locates Overwatch Maps
 */
class GameMap {

    /**
     * Finds the name of a map by ID
     * @param {string} guid the Map GUID
     * @param {string} locale the map language
     */
    static async getMap(guid) {
        const body = await JsonUtil.parse(Endpoints.get("MAPS"));
        return new Promise((resolve, reject) => {
            body.forEach(element => {
                if (element.guid == guid) {
                    resolve(MessageUtil.capitalizeSentence(element.name.en_US));
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
            body.forEach(element => {
                if (element.guid == guid) {
                    resolve(MessageUtil.capitalize(element.type));
                }
            });
            reject(null);
        })
    }
}
module.exports = GameMap;