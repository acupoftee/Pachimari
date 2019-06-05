'use strict';

const { JsonUtil, MessageUtil } = require('../../utils');
const Endpoints = require('../owl_models/Endpoints');

/**
 * @class MapManager
 * @description locates Overwatch Maps and its attributes
 */
class MapManager {

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
        });
    }

    /**
     * Finds the map icon by ID
     * @param {string} guid the Map GUID
     */
    static async getMapIcon(guid) {
        const body = await JsonUtil.parse(Endpoints.get("MAPS"));
        return new Promise((resolve, reject) => {
            body.forEach(element => {
                if (element.guid == guid) {
                    resolve(element.icon);
                }
            });
            reject(null);
        });
    }

    /**
     * Finds the map thumbnail by ID
     * @param {string} guid the Map GUID
     */
    static async getMapThumbnail(guid) {
        const body = await JsonUtil.parse(Endpoints.get("MAPS"));
        return new Promise((resolve, reject) => {
            body.forEach(element => {
                if (element.guid == guid) {
                    resolve(element.thumbnail);
                }
            });
            reject(null);
        });
    }

    /**
     * 
     * @param {string} guid 
     */
    static async getLiveMapState(guid) {
        const body = await JsonUtil.parse(Endpoints.get("LIVE-MATCH"));
        return new Promise((resolve, reject) => {
            body.data.liveMatch.games.forEach(element => {
                if (element.attributes.mapGuid == guid) {
                    resolve(element.state);
                }
            });
            reject(null);
        });
    }

    static async getNextMapState(guid) {
        const body = await JsonUtil.parse(Endpoints.get("LIVE-MATCH"));
        return new Promise((resolve, reject) => {
            body.data.nextMatch.games.forEach(element => {
                if (element.attributes.mapGuid == guid) {
                    resolve(element.state);
                }
            });
            reject(null);
        });
    }
}
module.exports = MapManager;