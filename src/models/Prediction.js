'use strict';

class Prediction {
    constructor(homeTeam, homeScore, awayTeam, awayScore) {
        this._homeTeam = homeTeam;
        this._homeScore = homeScore;
        this._awayTeam = awayTeam;
        this._awayScore = awayScore;
    }

    get homeTeam() {
        return this._homeTeam;
    }

    get homeScore() {
        return this._homeScore;
    }

    get awayTeam() {
        return this._awayTeam;
    }

    get awayScore() {
        return this._awayScore;
    }
}
module.exports = Prediction;