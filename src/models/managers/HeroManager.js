const heroes = require('../../data/heroes.json');

class HeroManager {
    /**
     * Finds a hero by nickname
     * @param {string} val the hero's name
     * @returns a hero name
     */
    static locateHero(val) {
        const name = val.toLowerCase();
        let hero;
        for (let i = 0; i < heroes.length; i++) {
            // return id if names are equal
            if (heroes[i].key == name) {
                hero = heroes[i].key;
                break;
            } else {
                for (let j = 0; j < heroes[i].aliases.length; j++) {
                    if (heroes[i].aliases[j] == name) {
                        hero = heroes[i].key;
                        break;
                    }
                } 
            }
        }
        return hero;
    }

    /**
     * Finds a title by name
     * @param {string} val the hero's title
     * @returns a hero title
     */
    static getHeroTitle(val) {
        const key = val.toLowerCase();
        for (let i = 0; i < heroes.length; i++) {
            if (heroes[i].key === key) {
                return heroes[i].title;
            }
        }
    }

     /**
     * Finds a color by name
     * @param {string} val the hero's color
     * @returns a hero color
     */
    static getHeroColor(val) {
        const key = val.toLowerCase();
        for (let i = 0; i < heroes.length; i++) {
            if (heroes[i].key === key) {
                return heroes[i].color;
            }
        }
    }

    /**
     * Finds a url by name
     * @param {string} val the hero's url
     * @returns a hero url
     */
    static getHeroURL(val) {
        const key = val.toLowerCase();
        for (let i = 0; i < heroes.length; i++) {
            if (heroes[i].key === key) {
                return heroes[i].portrait;
            }
        }
    }

     /**
     * Finds a ultimate by name
     * @param {string} val the hero's ultimate
     * @returns a hero ultimate
     */
    static getHeroUltimate(val) {
        const key = val.toLowerCase();
        for (let i = 0; i < heroes.length; i++) {
            if (heroes[i].key === key) {
                return heroes[i].ultimate;
            }
        }
    }
}
module.exports = HeroManager;