import bomb from './bomb.js';
import explosion from './explosion.js';
import item from './item.js';
import players from './players';
/*
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');*/

// disable blur on zoom
// ctx.webkitImageSmoothingEnabled = false;
// ctx.mozImageSmoothingEnabled = false;
// ctx.imageSmoothingEnabled = false;

//initialisation de l'image sprite
//const wallUnbreakableImage = new Image();
//wallUnbreakableImage.src = "img/unbreakable-wall.png"
//
/*
//initialisation de l'image sprite
const playerSprite = new Image();
playerSprite.src = "img/sprite-personnage.png"*/

// const bombSprite = new Image();
// bombSprite.src = "img/sprite-bombe.png"

// const itemSprite = new Image();
// itemSprite.src = "img/sprite-item.png"

//let player = new players(24, 56, 1);
//clavier numero de la touche
//const keys = [];

// //tableau avec tt les objets bombes
// let tabBomb = [];

// let tabExplosion = [];

// let tabItem = [];
// //si on place une bombe
// let onPlaceBomb = false;

// -- 0 = vide 
// -- 1 = mure cassable
// -- x = mure incassable
// -- w = mure cassable
// let map = [
//     ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
//     ['0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0'],
//     ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
//     ['0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0'],
//     ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
//     ['0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0'],
//     ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
//     ['0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0', 'x', '0'],
//     ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']
// ];

//Constante de la map
// const mapConstant = {
//     w: 960, //240
//     h: 576, //144
//     startUp: 128, //32
//     startLeft: 32, //8
//     endBottom: 704, //176
//     endRight: 992, //248
// };

/*-------------------------------HITBOX--------------------------
class Shape2 {
    constructor(x, y, w, h, fill) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.fill = fill;
    }
}
let hitbox = new Shape2(29 * 4, 48 * 4, 16 * 4, 16 * 4, "#333");

function hitboxPlayerRect() {
    hitbox.h = player.hitboxWH;
    hitbox.w = player.hitboxWH;
    hitbox.x = player.hitboxX;
    hitbox.y = player.hitboxY;
    ctx.fillStyle = hitbox.fill;
    ctx.fillRect(hitbox.x, hitbox.y, hitbox.w, hitbox.h);

}*/


/*----------------------LISTERNER----------------------- */

//si on appuie sur une touche
//window.addEventListener('keydown', function(e) {
//    keys[e.key] = true;
//    //desactiver les actions sur la page
//    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab"].indexOf(e.code) > -1) {
//        e.preventDefault();
//    }
//});
////si on relache la touche
//window.addEventListener('keyup', function(e) {
//    if (e.key == " ") {
//        onPlaceBomb = false;
//    }
//    delete keys[e.key];
//});

/*--------------------------MOUVEMENT DU PERSONNAGE--------------------------- */

//deplacement du joueur + changement de la frame pour sa position + changement de son statue moving ou pas
//function movePlayer() {
//
//    //passer en param les condition pour les murs de colision
//    var y = (player.hitboxY - mapConstant.startUp) / (16 * 4);
//    var x = (player.hitboxX - mapConstant.startLeft) / (16 * 4);
//    var yTab = Math.floor((player.hitboxY - mapConstant.startUp) / (16 * 4));
//    var xTab = Math.floor((player.hitboxX - mapConstant.startLeft) / (16 * 4));
//    var yTab2 = Math.ceil((player.hitboxY - mapConstant.startUp) / (16 * 4));
//    var xTab2 = Math.ceil((player.hitboxX - mapConstant.startLeft) / (16 * 4));
//
//    //console.log("x: ", x, "y: ", y, "xTab: ", xTab, "yTab: ", yTab, "xTab2: ", xTab2, "yTab2: ", yTab2);
//
//    //quand on click sur les touches
//    if (keys['ArrowLeft'] || keys['q']) {
//        player.collideWallLeft(x, y, xTab2, yTab2, map);
//
//    } else if (keys['ArrowRight'] || keys['d']) {
//        player.collideWallRight(x, y, xTab, yTab, map);
//
//    } else if (keys['ArrowUp'] || keys['z']) {
//        player.collideWallUp(x, y, xTab2, yTab2, map)
//
//    } else if (keys['ArrowDown'] || keys['s']) {
//        player.collideWallDown(x, y, xTab, yTab, map)
//    } else if (keys[' '] || keys['Enter']) {
//        if (!onPlaceBomb) {
//            if (maxBombPlace(player.getNumberPlayer, player.getbombnumber)) {
//                placeBomb(x, y);
//                onPlaceBomb = true;
//            }
//        }
//    } else {
//        player.frameCount = 3;
//        player.moving = false;
//    }
//}


// /*----------------------------------BOMBE-----------------------------------*/

// //mettre des bombes sur la carte, prise en compte des autres bombe
// function placeBomb(x, y) {
//     var bombeexistante = false;
//     //si une bombe est deja dans le tableau a cette position, on ne pose pas de bombe
//     for (var i = 0; i < tabBomb.length; i++) {
//         if (tabBomb[i].x == Math.round(x) && tabBomb[i].y == Math.round(y)) {
//             bombeexistante = true;
//         }
//     }
//     //si y a pas de bombe on met une bombe
//     if (!bombeexistante) {
//         let bombe = new bomb(Math.round(x), Math.round(y), new Date(), player.bombpower, player.bombtype, player.getNumberPlayer);
//         tabBomb.push(bombe);
//         map[Math.round(y)][Math.round(x)] = 'b';
//     }
// }

// function maxBombPlace(player, numberofbomb) {
//     let number = 0;
//     for (let i = 0; i < tabBomb.length; i++) {
//         if (tabBomb[i].getNumberPlayer == player) {
//             number++;
//         }
//     }
//     if (numberofbomb <= number) {
//         return false;
//     }
//     return true;
// }

// //lorqu'une bombe explose (mure,muree incassable, bombe et joueur)
// function explosionOfBomb(x, y, power) {

//     //droite
//     for (let i = 1; i <= power; i++) {
//         //bombe
//         if (x + i < map[0].length) {
//             //bombe
//             if (map[y][x + i] === 'b') {
//                 tabBomb.find(x1 => x1.x === (i + x) && x1.y === y).forceExplosion();
//             }
//             //unbreakeable
//             else if (map[y][x + i] === 'x') {
//                 i = power + 1;
//             }
//             //wall
//             else if (map[y][x + i] === 'w') {
//                 map[y][x + i] = '0';
//                 //generer des items
//                 isItemGenerate(x + i, y);
//                 //pour casser que un mur
//                 i = power + 1;
//             } else {
//                 let explosionfct;
//                 if (explosionTabExist(x + i, y)) {
//                     if (i === power) {
//                         explosionfct = new explosion(x + i, y, 4, 16);
//                     } else {
//                         explosionfct = new explosion(x + i, y, 4, 15);
//                     }
//                     tabExplosion.push(explosionfct);
//                 }
//             }
//         }
//     }

//     //gauche
//     for (let i = 1; i <= power; i++) {
//         if (x - i >= 0) {
//             //bombe
//             if (map[y][x - i] === 'b') {
//                 tabBomb.find(x1 => x1.x === (x - i) && x1.y === y).forceExplosion();
//             }
//             //unbreakeable
//             else if (map[y][x - i] === 'x') {
//                 i = power + 1;
//             }
//             //wall
//             else if (map[y][x - i] === 'w') {
//                 map[y][x - i] = '0';
//                 //generer des items
//                 isItemGenerate(x - i, y);
//                 //pour casser que un mur
//                 i = power + 1;
//             } else {
//                 if (explosionTabExist(x - i, y)) {
//                     let explosionfct;
//                     if (i === power) {
//                         explosionfct = new explosion(x - i, y, 4, 14);
//                     } else {
//                         explosionfct = new explosion(x - i, y, 4, 13);
//                     }
//                     tabExplosion.push(explosionfct);
//                 }
//             }
//         }
//     }

//     //bas
//     for (let i = 1; i <= power; i++) {
//         if (y + i < map.length) {
//             //bombe
//             if (map[y + i][x] === 'b') {
//                 tabBomb.find(x1 => x1.x === x && x1.y === (y + i)).forceExplosion();
//             }
//             //unbreakeable
//             else if (map[y + i][x] === 'x') {
//                 i = power + 1;
//             }
//             //wall
//             else if (map[y + i][x] === 'w') {
//                 map[y + i][x] = '0';
//                 //generer des items
//                 isItemGenerate(x, y + i);
//                 //pour casser que un mur
//                 i = power + 1;
//             } else {
//                 if (explosionTabExist(x, y + i)) {
//                     let explosionfct;
//                     if (i === power) {
//                         explosionfct = new explosion(x, y + i, 4, 12);
//                     } else {
//                         explosionfct = new explosion(x, y + i, 4, 11);
//                     }
//                     tabExplosion.push(explosionfct);
//                 }
//             }
//         }

//     }

//     //haut
//     for (let i = 1; i <= power; i++) {
//         if (y - i >= 0) {
//             //bombe
//             if (map[y - i][x] === 'b') {
//                 tabBomb.find(x1 => x1.x === x && x1.y === (y - i)).forceExplosion();
//             }
//             //unbreakeable
//             else if (map[y - i][x] === 'x') {
//                 i = power + 1;
//             }
//             //wall
//             else if (map[y - i][x] === 'w') {
//                 map[y - i][x] = '0';
//                 //generer des items
//                 isItemGenerate(x, y - i);
//                 //pour casser que un mur
//                 i = power + 1;
//             } else {
//                 if (explosionTabExist(x, y - i)) {
//                     let explosionfct;
//                     if (i === power) {
//                         explosionfct = new explosion(x, y - i, 4, 8);
//                     } else {
//                         explosionfct = new explosion(x, y - i, 4, 9);
//                     }
//                     tabExplosion.push(explosionfct);
//                 }
//             }
//         }
//     }

// }

// function explosionTabExist(x, y) {
//     if (tabExplosion.find(x1 => x1.x === (x) && x1.y === y)) {
//         return false;
//     }
//     return true
// }
// //supprime la bombe qui a explosé du tableau
// function deletetabomb(x, y) {
//     map[y][x] = '0';
// }

// //fonction generale pour les tests de bombe
// function bombGeneral() {
//     for (let i = 0; i < tabBomb.length; i++) {
//         //si ca explose on le supprime tu tab et on affiche explosion
//         tabBomb[i].timeBeforeExplosion();
//         if (tabBomb[i].isExplosed()) {
//             if (tabBomb[i].isExplosed2()) {
//                 explosionOfBomb(tabBomb[i].getx, tabBomb[i].gety, tabBomb[i].getpower);
//                 //suppression de la map
//                 deletetabomb(tabBomb[i].getx, tabBomb[i].gety);
//             }
//             if (tabBomb[i].explosionFrameIsDone()) {
//                 //suppresion du tableau
//                 tabBomb.splice(i, 1);
//             } else {
//                 tabBomb[i].handleExplosionFrame();
//             }
//         } else {
//             //on affiche la bombe
//             tabBomb[i].handleBombFrame();
//         }
//     }
//     for (let i = 0; i < tabExplosion.length; i++) {
//         if (tabExplosion[i].explosionFrameIsDone()) {
//             //suppresion du tableau
//             tabExplosion.splice(i, 1);
//         } else {
//             tabExplosion[i].handleExplosionFrame();
//         }
//     }
// }
// /*-----------------WALL------------------- */

// //genere un nombre aléatoire
// function getRandomArbitrary(min, max) {
//     return Math.random() * (max - min) + min;
// }

// //nombre de mur générer
// function numberOfWallGenerate() {
//     let placeForWall = (map.length * map[0].length) - (Math.floor(map.length / 2) * Math.floor(map[0].length / 2));
//     let statOfWall = getRandomArbitrary(0.55, 0.80);
//     let numberWallGenerate = Math.round(placeForWall * statOfWall);
//     placeWallInMapArray(numberWallGenerate);
// }

// //mettre les w dans le tableau
// function placeWallInMapArray(numberWallGenerate) {
//     var indexesI = [],
//         indexesJ = [],
//         i, j, alea;

//     //met la position de i et j de tt les 0 dans le chaque tab associé
//     for (i = 0; i < map.length; i++) {
//         for (j = 0; j < map[0].length; j++) {
//             if (map[i][j] === '0') {
//                 indexesI.push(i);
//                 indexesJ.push(j);
//             }
//         }
//     }

//     //supprimer les espaces pour les players
//     let tab = [106, 105, 93, 92, 91, 84, 22, 15, 14, 13, 1, 0];
//     for (i = 0; i < tab.length; i++) {
//         indexesI.splice(tab[i], 1);
//         indexesJ.splice(tab[i], 1);
//     }

//     //remplace les 0 par des w dans le tableau
//     for (i = 0; i < numberWallGenerate; i++) {
//         alea = Math.floor(getRandomArbitrary(0, indexesI.length));
//         var y = parseInt(indexesI[alea]);
//         var x = parseInt(indexesJ[alea]);
//         map[y][x] = 'w';
//         indexesI.splice(alea, 1);
//         indexesJ.splice(alea, 1);
//     }
// }

// function placeWallSprite() {
//     for (let i = 0; i < map.length; i++)
//         for (let j = 0; j < map[0].length; j++)
//             if (map[i][j] === 'w') {
//                 ctx.drawImage(bombSprite, 16 * 23, 0, 16, 20, j * 64 + mapConstant.startLeft, i * 64 + mapConstant.startUp - 16, 16 * 4, 20 * 4);
//             }
// }

// numberOfWallGenerate();

// /*----------------------------ITEM--------------------------- */

// function isItemGenerate(x, y) {
//     let probaItem = getRandomArbitrary(0, 100);
//     if (probaItem > 50) {
//         let items = new item(x, y);
//         items.generateteItem();
//         tabItem.push(items);

//     }
// }

// function playerOnItem() {
//     for (let i = 0; i < tabItem.length; i++) {
//         {
//             if (player.boxX == tabItem[i].getX && player.boxY == tabItem[i].getY) {
//                 player.powerUp(tabItem[i].getType);
//                 tabItem.splice(i, 1);
//             }
//         }
//     }
// }
/*-----------------------------TIME------------------------- */
//let fpsInterval, fpsInterval2, now, then, elapsed;

//function startAnimating(fps, fps2) {
//    //Frame for animation
//    fpsInterval = 1000 / fps;
//    //Frame for the movement actualisation
//    fpsInterval2 = 1000 / fps2;
//    then = Date.now();
//    animate();
//}
//
/*--------------------------BOUCLE INFINI------------------------------- */

//boucle infinie avec une actualisation séparer une pour les frames a afficher
//une autre pour le deplaecement propre
function animate() {
    //requestAnimationFrame(animate);

    //now = Date.now();
    //elapsed = now - then;
    //boucle1
    if (elapsed > fpsInterval) {
        //then = now - (elapsed % fpsInterval);
        //deplacement du joueur
        //player.handlePlayerFrame();
        //pour les bombes
        bombGeneral();
        //pour les items
        playerOnItem();
    }

    //Affichage plus rapide que les calculs
    if (elapsed > fpsInterval2) {
        //clear la map
        //ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < tabItem.length; i++) {
            tabItem[i].drawItem(mapConstant.startLeft, mapConstant.startUp, ctx, itemSprite);
        }

        for (let i = 0; i < tabBomb.length; i++) {
            if (tabBomb[i].isExplosed()) {
                //affiche l'explosion
                tabBomb[i].drawExplosion(mapConstant.startLeft, mapConstant.startUp, ctx, bombSprite);
            } else {
                tabBomb[i].drawbomb(mapConstant.startLeft, mapConstant.startUp, ctx, bombSprite);
            }
        }
        //afficher les explosion sans le centre
        for (let i = 0; i < tabExplosion.length; i++) {
            tabExplosion[i].drawExplosion(mapConstant.startLeft, mapConstant.startUp, ctx, bombSprite);
        }



        //placeWallSprite();
        //player.drawSprite(ctx, playerSprite);
        //movePlayer();
        //player.hitboxPlayer();

        //afficher le haut des mur pour que les objet sois en dessous 
        //ctx.drawImage(wallUnbreakableImage, 0, 0, 256 * 4, 192 * 4);
    }



}

startAnimating(5, 70);