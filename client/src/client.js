import Player from "./player.js";
import bomb from "./bomb.js";
import explosion from "./explosion.js";
import item from "./item.js";
import { MAP } from "./const.js";

/*CONSTANTE */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//disable blur on zoom
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

const playerSprite = [];

//initialisation de l'image sprite
for (let i = 0; i < 8; i++) {
  let playertemp = new Image();
  playertemp.src = "img/player/player" + (i + 1) + ".png";
  playerSprite.push(playertemp);
}

//initialisation de l'image sprite
const wallUnbreakableImage = new Image();
wallUnbreakableImage.src = "img/unbreakable-wall.png";

const bombSprite = new Image();
bombSprite.src = "img/sprite-bombe.png";

const itemSprite = new Image();
itemSprite.src = "img/sprite-item.png";

let stateGame = 0;

//numero du joueur,
let playernumber = 0;
//position du jouer dans le tab de player
let playernumberTab = 0;

//numero de la room
let roomnumber = "";

const keys = {};

let characters = {};

//let tabplayers = [];

//tableau avec tt les objets bombes
//let tabBomb = [];

//let tabExplosion = [];

//let tabItem = [];
//si on place une bombe
//let onPlaceBomb = false;

// -- 0 = vide
// -- 1 = mure cassable
// -- x = mure incassable
// -- w = mure cassable
let map = [];

//------------------------SOCKET------------------------

//lorsque l'on recois pour afficher
const messageShow = (text, user, you) => {
  const parent = document.querySelector("#events");
  const name = document.createElement("li");
  const chat = document.createElement("li");
  chat.innerHTML = text;

  if (you == 1) {
    chat.setAttribute("id", "me");
  } else {
    chat.setAttribute("id", "other");
    name.setAttribute("id", "name");
    name.innerHTML = user.name;
    parent.appendChild(name);
  }

  parent.appendChild(chat);
  parent.scrollTop = parent.scrollHeight;
};

//tout les pseudos partout
const userList = (users, number) => {
  for (let i = 0; i < 8; i++) {
    const nameid = "player" + (1 + i);
    const divname = document.querySelector("#" + nameid);
    divname.innerHTML = "";
  }
  for (let i = 0; i < users.length; i++) {
    const nameid = "player" + number[i];
    const divname = document.querySelector("#" + nameid);
    divname.innerHTML = users[i];
  }

  for (let i = 0; i < 8; i++) {
    const nameid = "chooseplayer" + (1 + i);
    const divname = document.querySelector("#" + nameid);
    divname.innerHTML = "";

    const inputid = "inputchooseplayer" + (1 + i);
    const input = document.querySelector("#" + inputid);
    input.disabled = false;
  }

  for (let i = 0; i < users.length; i++) {
    const nameid = "chooseplayer" + number[i];
    const divname = document.querySelector("#" + nameid);
    divname.innerHTML = users[i];

    const inputid = "inputchooseplayer" + number[i];
    const input = document.querySelector("#" + inputid);
    input.disabled = true;
  }
};

//btn start
const admin = (admin) => {
  if (admin) {
    document.querySelector("#start").disabled = false;
  }
};

//pour tout les tableaux
// const getGameParam = (param) => {
//   let playertemp;
//   tabplayers = [];
//   for (let i = 0; i < param.tabplayers.length; i++) {
//     if (param.tabplayers[i].numberplayer == playernumber) {
//       playernumberTab = i;
//     }
//     playertemp = new players(param.tabplayers[i]);
//     tabplayers.push(playertemp);
//   }

//   let bombtemp;
//   tabBomb = [];
//   for (let i = 0; i < param.tabBomb.length; i++) {
//     bombtemp = new bomb(param.tabBomb[i]);
//     tabBomb.push(bombtemp);
//   }

//   let explosiontemp;
//   tabExplosion = [];

//   for (let i = 0; i < param.tabExplosion.length; i++) {
//     explosiontemp = new explosion(param.tabExplosion[i]);
//     tabExplosion.push(explosiontemp);
//   }

//   let itemtemp;
//   tabItem = [];

//   for (let i = 0; i < param.tabItem.length; i++) {
//     itemtemp = new item(param.tabItem[i]);
//     tabItem.push(itemtemp);
//   }

//   map = param.map;
// };

//SEND

//lorque l'on envoie le chat
const onChatSubmitted = (sock) => (e) => {
  e.preventDefault();
  const input = document.querySelector("#chat");
  const text = input.value;
  input.value = "";
  sock.emit("message", text, roomnumber);
};

//choisir le username et la room et on envoie au serv
//--join
const onUsernameSubmitted = (sock) => (e) => {
  e.preventDefault();

  const name = document.querySelector("#usernameInput");
  const room = document.querySelector("#roomInput");
  if (name.value.trim() == "") {
    const error = document.querySelector("#error");
    name.value = "";
    error.innerHTML = "Veuillez rentrer un nom valide !";
  } else {
    const param2 = JSON.stringify({ name: name.value, room: room.value });
    const param = JSON.parse(param2);
    //vider les inputs
    name.value = "";
    room.value = "";
    //cacher la partie
    document.getElementById("username").hidden = true;

    //stocker le nom de la room
    roomnumber = param.room;

    sock.emit("joinRoom", param);
  }
};

//click sur un radio btn
const displayRadioValue = (sock) => (e) => {
  e.preventDefault();
  var ele = document.getElementsByName("player");
  for (let i = 0; i < ele.length; i++) {
    if (ele[i].checked) {
      sock.emit("changePlayerNumber", i + 1);
    }
  }
};

const onStart = (sock) => (e) => {
  e.preventDefault();
  sock.emit("start");
};

const drawCharacters = () => {
  // Effacez le canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dessinez chaque personnage
  for (const id in characters) {
    const character = characters[id];
    ctx.fillStyle = "red";
    ctx.fillRect(character.x, character.y, 50, 50);
  }
};

//ajoute un player dans le tableau
const addPlayer = (param) => {
  const character = new Player(param);
  characters[param.id] = character;
  drawCharacters();
  console.log(characters);
};

const sock = io();
//---------LAUNCH----------
(() => {
  //------------GET------------

  sock.on("message", messageShow); //quand le client recois un message

  sock.on("updateUserList", userList);

  sock.on("admin", admin);

  sock.on("stateGame", (state) => (stateGame = state));

  sock.on("playernumberTab", (param) => (playernumber = param));

  //sock.on("paramGame", getGameParam);

  sock.on("addCharacter", addPlayer);

  //------------SEND------------
  document
    .querySelector("#chat-form")
    .addEventListener("submit", onChatSubmitted(sock));

  //pour la connection a la room et avec ton nom on lance la fonction
  document
    .querySelector("#username_form")
    .addEventListener("submit", onUsernameSubmitted(sock));

  //click sur start
  document.querySelector("#start").addEventListener("click", onStart(sock));

  //quand on change de joueur
  if (document.querySelector('input[name="player"]')) {
    document.querySelectorAll('input[name="player"]').forEach((elem) => {
      elem.addEventListener("change", displayRadioValue(sock));
    });
  }
})();

/*----------------------LISTERNER----------------------- */

//si on appuie sur une touche
window.addEventListener("keydown", function (e) {
  keys[e.key] = true;
  //desactiver les actions sur la page
  if (
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab"].indexOf(e.code) >
    -1
  ) {
    e.preventDefault();
  }
  movePlayer();
});

//si on relache la touche
window.addEventListener("keyup", function (e) {
  if (stateGame == 1)
    if (e.key == " ") {
      onPlaceBomb = false;
    }
  delete keys[e.key];
});

/*--------------------------MOUVEMENT DU PERSONNAGE--------------------------- */

//deplacement du joueur + changement de la frame pour sa position + changement de son statue moving ou pas
function movePlayer() {
  console.log("test");

  //passer en param les condition pour les murs de colision
  // var y = (tabplayers[playernumberTab].hitboxY - MAP.startUp) / (16 * 4);
  // var x = (tabplayers[playernumberTab].hitboxX - MAP.startLeft) / (16 * 4);
  // var yTab = Math.floor(
  //   (tabplayers[playernumberTab].hitboxY - MAP.startUp) / (16 * 4)
  // );
  // var xTab = Math.floor(
  //   (tabplayers[playernumberTab].hitboxX - MAP.startLeft) / (16 * 4)
  // );
  // var yTab2 = Math.ceil(
  //   (tabplayers[playernumberTab].hitboxY - MAP.startUp) / (16 * 4)
  // );
  // var xTab2 = Math.ceil(
  //   (tabplayers[playernumberTab].hitboxX - MAP.startLeft) / (16 * 4)
  // );

  var lastKeyPressed = null;

  if (Object.keys(keys).length > 0) {
    lastKeyPressed = Object.keys(keys)[Object.keys(keys).length - 1];
  }
  const character = characters[sock.id];
  const speed = 5;
  //quand on click sur les touches
  if (lastKeyPressed == "ArrowLeft" || lastKeyPressed == "q") {
    character.move(-speed, 0);
    drawCharacters();

    //tabplayers[playernumberTab].collideWallLeft(x, y, xTab2, yTab2, map);
  } else if (lastKeyPressed == "ArrowRight" || lastKeyPressed == "d") {
    character.move(speed, 0);
    drawCharacters();

    //tabplayers[playernumberTab].collideWallRight(x, y, xTab, yTab, map);
  } else if (lastKeyPressed == "ArrowUp" || lastKeyPressed == "z") {
    character.move(0, -speed);
    drawCharacters();

    //tabplayers[playernumberTab].collideWallUp(x, y, xTab2, yTab2, map);
  } else if (lastKeyPressed == "ArrowDown" || lastKeyPressed == "s") {
    character.move(0, speed);
    drawCharacters();

    //tabplayers[playernumberTab].collideWallDown(x, y, xTab, yTab, map);
  } else if (lastKeyPressed == " " || lastKeyPressed == "Enter") {
    //if (!onPlaceBomb) {
    //  if (
    //    maxBombPlace(
    //      tabplayers[playernumberTab].getNumberPlayer,
    //      tabplayers[playernumberTab].getbombnumber
    //    )
    //  ) {
    //    sock.emit("addBomb", x, y);
    //    //placeBomb(x, y);
    //    onPlaceBomb = true;
    //  }
    //}
  } else {
    //if (tabplayers[playernumberTab].moving !== false) {
    //  tabplayers[playernumberTab].frameCount = 3;
    //  tabplayers[playernumberTab].moving = false;
    //}
  }
}

/*----------------------------------BOMBE-----------------------------------*/

//si le joueur a placer son nb max de bombe
function maxBombPlace(player, numberofbomb) {
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

/*-----------------WALL------------------- */

function placeWallSprite() {
  for (let i = 0; i < map.length; i++)
    for (let j = 0; j < map[0].length; j++)
      if (map[i][j] === "w") {
        ctx.drawImage(
          bombSprite,
          16 * 23,
          0,
          16,
          20,
          j * 64 + MAP.startLeft,
          i * 64 + MAP.startUp - 16,
          16 * 4,
          20 * 4
        );
      }
}

/*-----------------------------TIME------------------------- */
let fpsInterval, fpsInterval2, now, then, elapsed;

function startAnimating(fps, fps2) {
  //Frame for animation
  fpsInterval = 1000 / fps;
  //Frame for the movement actualisation
  fpsInterval2 = 1000 / fps2;
  then = Date.now();
  animate();
}

/*--------------------------BOUCLE INFINI------------------------------- */

//boucle infinie avec une actualisation séparer une pour les frames a afficher
//une autre pour le deplaecement propre
function animate() {
  requestAnimationFrame(animate);
  if (stateGame === 1) {
    now = Date.now();
    elapsed = now - then;
    //boucle1
    if (elapsed > fpsInterval) {
      then = now - (elapsed % fpsInterval);
      //deplacement du joueur
      tabplayers[playernumberTab].handlePlayerFrame();
    }
  }

  //Affichage plus rapide que les calculs
  if (elapsed > fpsInterval2) {
    //clear la map
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < tabItem.length; i++) {
      tabItem[i].drawItem(MAP.startLeft, MAP.startUp, ctx, itemSprite);
    }

    for (let i = 0; i < tabBomb.length; i++) {
      if (tabBomb[i].isExplosed()) {
        //affiche l'explosion
        tabBomb[i].drawExplosion(MAP.startLeft, MAP.startUp, ctx, bombSprite);
      } else {
        tabBomb[i].drawbomb(MAP.startLeft, MAP.startUp, ctx, bombSprite);
      }
    }

    //afficher les explosion sans le centre
    for (let i = 0; i < tabExplosion.length; i++) {
      tabExplosion[i].drawExplosion(
        MAP.startLeft,
        MAP.startUp,
        ctx,
        bombSprite
      );
    }

    placeWallSprite();

    for (let i = 0; i < tabplayers.length; i++) {
      tabplayers[i].drawSprite(
        ctx,
        playerSprite[tabplayers[i].getNumberPlayer - 1]
      );
      tabplayers[i].hitboxPlayer();
    }

    movePlayer();
    sock.volatile.emit(
      "editplayer",
      tabplayers[playernumberTab],
      playernumberTab
    );

    //afficher le haut des mur pour que les objet sois en dessous
    ctx.drawImage(wallUnbreakableImage, 0, 0, 256 * 4, 384 * 4);
  }
}

startAnimating(5, 60);
