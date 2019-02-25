'use strict';

/**
 * @class Match
 * @descriptions represents an Overwatch League Match object
 */
class Match {
    /**
     * Instantiates a new Match object
     * @constructor
     * @param {*} id 
     * @param {*} pending 
     * @param {*} state 
     * @param {*} startDateTS 
     * @param {*} home 
     * @param {*} away 
     * @param {*} scoreHome 
     * @param {*} scoreAway 
     */
    constructor(id, pending, state, startDateTS, home, away, scoreHome, scoreAway) {
        this._id = id;
        this._pending = pending;
        this._state = state;
        this._startDateTS = startDateTS;
        this._home = home;
        this._away = away;
        this._scoreHome = scoreHome;
        this._scoreAway = scoreAway;
    } 

    get id() {
        return this._id;
    }

    get pending() {
        return this._pending;
    }

    get state() {
        return this._state;
    }

    get startDateTS() {
        return this._startDateTS;
    }

    get home() {
        return this._home;
    }

    get away() {
        return this._away;
    }

    get scoreHome() {
        return this._scoreHome;
    }

    get scoreAway() {
        return this._scoreAway;
    }
}
module.exports = Match;