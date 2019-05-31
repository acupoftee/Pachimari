'use strict';

class Video {
    constructor(uniqueId, date, title, description, thumbnail, shareURL) {
        this._uniqueId = uniqueId;
        this._date = date;
        this._title = title;
        this._description = description;
        this._thumbnail = thumbnail;
        this._shareURL = shareURL;
    }

    get uniqueId() {
        return this._uniqueId;
    }

    get date() {
        return this._date;
    }
<<<<<<< HEAD
    
=======

>>>>>>> master
    get title() {
        return this._title;
    }

    get description() {
        return this._description;
    }

    get thumbnail() {
        return this._thumbnail;
    }

    get shareURL() {
        return this._shareURL;
    }
}
module.exports = Video;