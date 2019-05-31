'use strict';
	
	/**
	 * @class Hero
	 * @description An object for representing hero information such as id, 
	 * name, and stats
	 */
	class Hero {
	    /**
	     * @param {string} heroId 
	     * @param {string} name 
	     * @param {number} eliminations 
	     * @param {number} deaths 
	     * @param {number} damage 
	     * @param {number} healing 
	     * @param {number} ultimates 
	     * @param {number} finalBlows 
	     * @param {number} timePlayed 
	     */
	    constructor(heroId, name, eliminations, deaths, damage, healing, ultimates, finalBlows, timePlayed) {
	        this._heroId = heroId;
	        this._name = name;
	        this._eliminations = eliminations;
	        this._deaths = deaths; 
	        this._damage = damage;
	        this._healing = healing;
	        this._ultimates = ultimates;
	        this._finalBlows = finalBlows;
	        this._timePlayed = timePlayed;
	    }
	
	    get heroId() {
	        return this._heroId;
	    }
	
	    get name() {
	        return this._name;
	    }
	
	    get eliminations() {
	        return this._eliminations;
	    }
	
	    get deaths() {
	        return this._deaths;
	    }
	
	    get damage() {
	        return this._damage;
	    }
	
	    get healing() {
	        return this._healing;
	    }
	
	    get ultimates() {
	        return this._ultimates;
	    }
	
	    get finalBlows() {
	        return this._finalBlows;
	    }
	
	    get timePlayed() {
	        return this._timePlayed;
	    }
	}
	module.exports = Hero;