const { players } = require('./players.js');
const { bomb } = require('./bomb.js');

class Settings {
    constructor() {
        this.settings = [];
        this.game = [];
        /*{
           "room": "Le nom de la room",
           "tabplayers": [Object Player],
           "tabBomb": [Object Bomb],
           "tabExplosion": [Object Explosion],
           "tabItem": [Object Item],
           "map" : [Tab Map]
       }*/
    }

    /*---------------Game---------------*/
    //demarrage de la partie
    start(room, numberofplayer) {
        //PLayer creation et assignation
        let player;
        let tabplayers = [];
        let tabBomb = [];
        for (let i = 0; i < numberofplayer.length; i++) {
            player = new players(24, 56, numberofplayer[i]);
            //console.log(player)
            tabplayers.push(player);
        }
        //map
        let map = [
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ['x', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', 'x'],
            ['x', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', 'x'],
            ['x', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', 'x'],
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']
        ];

        //generation des walls
        //map = this.numberOfWallGenerate(map);

        let game = { room, tabplayers, map, tabBomb };
        this.game.push(game);
    }

    //recupere tt les parametre de la room
    getAllOfAGame(room) {
        return this.game.filter((game) => game.room === room)[0];
    }

    getGame(room) {
        return this.settings.filter((game) => game.room === room);
    }

    //met a jour tout les parametre du client sur le serveur
    updatePlayer(numbertab, room, tabplayers) {
        let roomgame = this.game.filter((user) => user.room === room);
        Object.assign(roomgame[0].tabplayers[numbertab], tabplayers);
    }

    //supprimer un settings
    removeGame(room) {
        let game = this.getGame(room);
        if (game) {
            this.game = this.game.filter((game) => game.room !== room);
        }
    }

    /*-----------------WALL------------------- */

    //genere un nombre aléatoire
    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    //nombre de mur générer
    numberOfWallGenerate(map) {
        let placeForWall = (map.length * map[0].length) - (Math.floor(map.length / 2) * Math.floor(map[0].length / 2));
        let statOfWall = this.getRandomArbitrary(0.55, 0.80);
        let numberWallGenerate = Math.round(placeForWall * statOfWall);
        return this.placeWallInMapArray(numberWallGenerate, map);
    }

    //mettre les w dans le tableau
    placeWallInMapArray(numberWallGenerate, map) {
        var indexesI = [],
            indexesJ = [],
            i, j, alea;

        //met la position de i et j de tt les 0 dans le chaque tab associé
        for (i = 0; i < map.length; i++) {
            for (j = 0; j < map[0].length; j++) {
                if (map[i][j] === '0') {
                    indexesI.push(i);
                    indexesJ.push(j);
                }
            }
        }

        //supprimer les espaces pour les players
        let tab = [231, 230, 218, 217, 216, 209, 147, 140, 139, 138, 126, 125, 124, 123, 122, 121, 120, 119, 118, 117, 116, 115, 114, 113, 112, 111, 110, 109, 108, 107, 106, 105, 93, 92, 91, 84, 22, 15, 14, 13, 1, 0];
        for (i = 0; i < tab.length; i++) {
            indexesI.splice(tab[i], 1);
            indexesJ.splice(tab[i], 1);
        }

        //remplace les 0 par des w dans le tableau
        for (i = 0; i < numberWallGenerate; i++) {
            alea = Math.floor(this.getRandomArbitrary(0, indexesI.length));
            var y = parseInt(indexesI[alea]);
            var x = parseInt(indexesJ[alea]);
            map[y][x] = 'w';
            indexesI.splice(alea, 1);
            indexesJ.splice(alea, 1);
        }
        console.log(map)
        return map;
    }

    /*----------------BOMB----------------- */

    //mettre des bombes sur la carte, prise en compte des autres bombe
    placeBomb(room, x, y, playerparam) {
        var bombeexistante = false;

        let game = this.game.filter((game) => game.room === room)[0];
        let tab_player = game.tabplayers;

        let player = tab_player.filter((game) => game.numberplayer === playerparam.numberplayer)[0];


        //si une bombe est deja dans le tableau a cette position, on ne pose pas de bombe
        for (var i = 0; i < game.tabBomb.length; i++) {
            if (game.tabBomb[i].x == Math.round(x) && game.tabBomb[i].y == Math.round(y)) {
                bombeexistante = true;
            }
        }
        //si y a pas de bombe on met une bombe
        if (!bombeexistante) {
            let bombe = new bomb(Math.round(x), Math.round(y), new Date(), player.bombpower, player.bombtype, player.numberplayer);
            game.tabBomb.push(bombe);
            //map[Math.round(y)][Math.round(x)] = 'b';
        }
    }

    maxBombPlace(player, numberofbomb) {
        let number = 0;
        for (let i = 0; i < tabBomb.length; i++) {
            if (tabBomb[i].getNumberPlayer == player) {
                number++;
            }
        }
        if (numberofbomb <= number) {
            return false;
        }
        return true;
    }


    /*---------------SETTINGS--------------- */
    //liste de tt les setttings
    getSettingList() {
        return this.settings;
    }

    //param de settings 
    getSetting(room) {
        return this.settings.filter((setting) => setting.room === room);
    }

    //state de la game
    getState(room) {
        return this.settings.filter((setting) => setting.room === room)[0].state;
    }

    //0 : not start
    //1 : start
    //2 : waiting == pause
    //3 : end
    addSetting(room, state) {
        if (this.getSetting(room).length == 0) {
            let setting = { room, state };
            this.settings.push(setting);
            return setting;
        }
        return false
    }

    //supprimer un settings
    removeSetting(room) {
        let setting = this.getSetting(room);
        if (setting) {
            this.settings = this.settings.filter((setting) => setting.room !== room);
        }
    }

    //change la state de la room
    changeState(room, state) {
        this.removeSetting(room);
        let setting = { room, state };
        this.settings.push(setting);
    }
}

module.exports = { Settings }