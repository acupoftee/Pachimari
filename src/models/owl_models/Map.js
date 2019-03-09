'use strict';

/**
 * @class Map
 * @description defines an Overwatch map
 */
class Map {
    /**
     * Defines an Overwatch map and attributes used during an Overwatch League Map
     * @param {string} guid 
     * @param {string} name 
     * @param {string} icon 
     * @param {string} thumbnail 
     * @param {string} type 
     * @param {boolean} pending 
     * @param {string} state 
     */
    constructor(guid, name, icon, thumbnail, type, pending, state) {
        this._guid = guid;
        this._name = name;
        this._icon = icon;
        this._thumbnail = thumbnail;
        this._type = type;
        this._pending = pending;
        this._state = state;
    }

    get guid() {
        return this._guid;
    }

    get name() {
        return this._name;
    }

    get icon() {
        return this._icon;
    }

    get thumbnail() {
        return this._thumbnail;
    }

    get type() {
        return this._type;
    }

    get pending() {
        return this._pending;
    }

    get state() {
        return this._state;
    }
}
module.exports = Map;