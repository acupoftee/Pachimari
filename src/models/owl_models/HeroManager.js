const heroNames = require('../../data/heroes.json');

class HeroManager {
      /**
     * Finds a hero by nickname
     * @param {string} val the hero's name
     * @returns a hero
     */
    static locateHero(val) {
        const name = val.toLowerCase();
        let hero;
        for (let i = 0; i < heroNames.length; i++) {
            // return id if names are equal
            if (heroNames[i].key == name) {
                hero = heroNames[i].key;
                break;
            } else {
                for (let j = 0; j < heroNames[i].aliases.length; j++) {
                    if (heroNames[i].aliases[j] == name) {
                        hero = heroNames[i].key;
                        break;
                    }
                } 
            }
        }
        return hero;
    }
}
module.exports = HeroManager;