'use strict';

const endpoints = require('../data/endpoints.json');

/**
 * Obtains a URL for an API Endpoint
 * @returns {string} an API url
 */
class Endpoints {
    static get(endpoint, id=0) {
        let extension = endpoints[0].extension;
        for (let i = 0; i < endpoints.length; i++) {
            const point = endpoints[i];
            if (point.key === endpoint.toUpperCase()) {
                extension = point.extension;
            }
        }
        if (extension.match(/\{id\}/g)) {
            extension = extension.replace(/\{id\}/g, id.toString());
        }
        return 'https://api.overwatchleague.com/' + extension;
    }
}
module.exports = Endpoints;