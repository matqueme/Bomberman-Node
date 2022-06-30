const { players } = require('./players.js');
const { bomb } = require('./bomb.js');
const { explosion } = require('./explosion.js');
const { item } = require('./item.js');

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
        let tabExplosion = [];
        let tabItem = [];
        for (let i = 0; i < numberofplayer.length; i++) {
            player = new players(24, 56, numberofplayer[i]);
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
        map = this.numberOfWallGenerate(map);

        let game = { room, tabplayers, map, tabBomb, tabExplosion, tabItem };
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

    updateBomb() {
        for (let i = 0; i < this.settings.length; i++) {
            if (this.settings[i].state == 1) {
                let room = this.settings[i].room;
                let roomgame = this.game.filter((user) => user.room === room);
                let tabBomb = roomgame[0].tabBomb;
                let tabExplosion = roomgame[0].tabExplosion;

                for (let i = 0; i < tabBomb.length; i++) {
                    //si ca explose on le supprime tu tab et on affiche explosion
                    tabBomb[i].timeBeforeExplosion();
                    if (tabBomb[i].isExplosed()) {
                        if (tabBomb[i].isExplosed2()) {
                            this.explosionOfBomb(tabBomb[i].getx, tabBomb[i].gety, tabBomb[i].getpower, roomgame);
                            //suppression de la map
                            this.deletetabomb(tabBomb[i].getx, tabBomb[i].gety, roomgame);
                        }
                        if (tabBomb[i].explosionFrameIsDone()) {
                            //suppresion du tableau
                            tabBomb.splice(i, 1);
                        } else {
                            tabBomb[i].handleExplosionFrame();
                        }
                    } else {
                        //on affiche la bombe
                        tabBomb[i].handleBombFrame();
                    }
                }

                for (let i = 0; i < tabExplosion.length; i++) {
                    if (tabExplosion[i].explosionFrameIsDone()) {
                        //suppresion du tableau
                        tabExplosion.splice(i, 1);
                    } else {
                        tabExplosion[i].handleExplosionFrame();
                    }
                }
                this.playerOnItem(roomgame);
            }
        }
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
            game.map[Math.round(y)][Math.round(x)] = 'b';
        }
    }

    explosionOfBomb(x, y, power, paramroom) {
        let roomgame = paramroom;
        let tabBomb = roomgame[0].tabBomb;
        let tabExplosion = roomgame[0].tabExplosion;
        let tabItem = roomgame[0].tabItem;
        let map = roomgame[0].map;
        //droite
        for (let i = 1; i <= power; i++) {
            //bombe
            if (x + i < map[0].length) {
                //bombe
                if (map[y][x + i] === 'b') {
                    tabBomb.find(x1 => x1.x === (i + x) && x1.y === y).forceExplosion();
                }
                //unbreakeable
                else if (map[y][x + i] === 'x') {
                    i = power + 1;
                }
                //wall
                else if (map[y][x + i] === 'w') {
                    map[y][x + i] = '0';
                    //generer des items
                    this.isItemGenerate(x + i, y, tabItem);
                    //pour casser que un mur
                    i = power + 1;
                } else {
                    let explosionfct;
                    if (this.explosionTabExist(x + i, y, tabExplosion)) {
                        if (i === power) {
                            explosionfct = new explosion(x + i, y, 4, 16);
                        } else {
                            explosionfct = new explosion(x + i, y, 4, 15);
                        }
                        tabExplosion.push(explosionfct);
                    }
                }
            }
        }

        //gauche
        for (let i = 1; i <= power; i++) {
            if (x - i >= 0) {
                //bombe
                if (map[y][x - i] === 'b') {
                    tabBomb.find(x1 => x1.x === (x - i) && x1.y === y).forceExplosion();
                }
                //unbreakeable
                else if (map[y][x - i] === 'x') {
                    i = power + 1;
                }
                //wall
                else if (map[y][x - i] === 'w') {
                    map[y][x - i] = '0';
                    //generer des items
                    this.isItemGenerate(x - i, y, tabItem);
                    //pour casser que un mur
                    i = power + 1;
                } else {
                    if (this.explosionTabExist(x - i, y, tabExplosion)) {
                        let explosionfct;
                        if (i === power) {
                            explosionfct = new explosion(x - i, y, 4, 14);
                        } else {
                            explosionfct = new explosion(x - i, y, 4, 13);
                        }
                        tabExplosion.push(explosionfct);
                    }
                }
            }
        }

        //bas
        for (let i = 1; i <= power; i++) {
            if (y + i < map.length) {
                //bombe
                if (map[y + i][x] === 'b') {
                    tabBomb.find(x1 => x1.x === x && x1.y === (y + i)).forceExplosion();
                }
                //unbreakeable
                else if (map[y + i][x] === 'x') {
                    i = power + 1;
                }
                //wall
                else if (map[y + i][x] === 'w') {
                    map[y + i][x] = '0';
                    //generer des items
                    this.isItemGenerate(x, y + i, tabItem);
                    //pour casser que un mur
                    i = power + 1;
                } else {
                    if (this.explosionTabExist(x, y + i, tabExplosion)) {
                        let explosionfct;
                        if (i === power) {
                            explosionfct = new explosion(x, y + i, 4, 12);
                        } else {
                            explosionfct = new explosion(x, y + i, 4, 11);
                        }
                        tabExplosion.push(explosionfct);
                    }
                }
            }

        }

        //haut
        for (let i = 1; i <= power; i++) {
            if (y - i >= 0) {
                //bombe
                if (map[y - i][x] === 'b') {
                    tabBomb.find(x1 => x1.x === x && x1.y === (y - i)).forceExplosion();
                }
                //unbreakeable
                else if (map[y - i][x] === 'x') {
                    i = power + 1;
                }
                //wall
                else if (map[y - i][x] === 'w') {
                    map[y - i][x] = '0';
                    //generer des items
                    this.isItemGenerate(x, y - i, tabItem);
                    //pour casser que un mur
                    i = power + 1;
                } else {
                    if (this.explosionTabExist(x, y - i, tabExplosion)) {
                        let explosionfct;
                        if (i === power) {
                            explosionfct = new explosion(x, y - i, 4, 8);
                        } else {
                            explosionfct = new explosion(x, y - i, 4, 9);
                        }
                        tabExplosion.push(explosionfct);
                    }
                }
            }
        }
    }

    explosionTabExist(x, y, tabExplosion) {
        if (tabExplosion.find(x1 => x1.x === (x) && x1.y === y)) {
            return false;
        }
        return true
    }

    //supprime la bombe qui a explosé du tableau
    deletetabomb(x, y, roomgame) {
        roomgame[0].map[y][x] = '0';
    }

    /*----------------------------ITEM--------------------------- */

    isItemGenerate(x, y, tabItem) {
        let probaItem = this.getRandomArbitrary(0, 100);
        if (probaItem > 50) {
            let items = new item(x, y);
            items.generateteItem();
            tabItem.push(items);

        }
    }

    playerOnItem(paramroom) {
        let tabItem = paramroom[0].tabItem;
        let tabplayers = paramroom[0].tabplayers;
        for (let i = 0; i < tabItem.length; i++) {
            {
                for (let j = 0; j < tabplayers.length; j++) {
                    if (tabplayers[j].boxX == tabItem[i].x && tabplayers[j].boxY == tabItem[j].y) {
                        tabplayers[j].powerUp(tabItem[i].type);
                        tabItem.splice(i, 1);
                    }
                }
            }
        }
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