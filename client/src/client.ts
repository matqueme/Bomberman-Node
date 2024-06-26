import Player from "./player.js";
import Bomb from "./models/Bomb.js";
import BombType from "./models/Bomb.js";
import { MAP } from "./const.js";
import { HTMLADMIN } from "./const.js";
import { HTMLPLAYER } from "./const.js";
import { io, Socket } from "socket.io-client";

//import { TAPIS } from "./const.js";
interface ServerToClientEvents {
  message: (text: string, user: string, you: boolean) => void;
  // Ajoutez d'autres événements ici...
}

interface ClientToServerEvents {
  chat: (message: string) => void;
  // Ajoutez d'autres événements ici...
}
/*-----------------------CONSTANTE-----------------------*/

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

//disable blur on zoom
// ctx.webkitImageSmoothingEnabled = false;
// ctx.mozImageSmoothingEnabled = false;
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
wallUnbreakableImage.src = "img/map/unbreakableWall-1.png";

const bombSprite = new Image();
bombSprite.src = "img/sprite-bombe.png";

const itemsSprite = new Image();
itemsSprite.src = "img/sprite-item.png";

const wallSprite = new Image();
wallSprite.src = "img/walls.png";

const keys = {};

let characters = {};

let walls = { length: 0 };

let bombs = {};

let explosions = {};

let roomData = {
  roomName: "",
  mapParameter: {
    name: "Map 1",
    source: "map1.png",
    wall: "wall1.png",
    wallType: 1,
    tooltip: "Map 1",
  },
  gameStarted: false,
};

let items = {};

let tapis = [];

let buttonMappings = {
  A: "a",
  B: "z",
  X: "s",
  Y: "d",
  UP: "ArrowUp",
  DOWN: "ArrowDown",
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
};

/*-----------------------PARAMETRE TOUCHE-----------------------*/

const modal = document.querySelector(".modalParam") as HTMLDivElement;
const closeModal = modal.querySelector(".closeModal");
const annuler = modal.querySelector(".btnParamCancel");
const btnParamSave = modal.querySelector(".btnParamSave");
const svgTrigger = document.querySelector(".parameters");

const config1 = modal.querySelector("#config1");
const config2 = modal.querySelector("#config2");
const config3 = modal.querySelector("#config3");

closeModal.addEventListener("click", function () {
  modal.style.display = "none";
});

annuler.addEventListener("click", function () {
  modal.style.display = "none";
});

//Changer les fleches en touches
function tryArrow(key) {
  if (key === "↑") {
    return "ArrowUp";
  }
  if (key === "↓") {
    return "ArrowDown";
  }
  if (key === "←") {
    return "ArrowLeft";
  }
  if (key === "→") {
    return "ArrowRight";
  }
  return key;
}

//Afficher les fleches
function tryArrowDisplay(key) {
  if (key === "ArrowUp") {
    return "↑";
  }
  if (key === "ArrowDown") {
    return "↓";
  }
  if (key === "ArrowLeft") {
    return "←";
  }
  if (key === "ArrowRight") {
    return "→";
  }
  return key;
}

//Sauvegarder les parametres
btnParamSave.addEventListener("click", function () {
  buttonMappings.UP = tryArrow(document.getElementById("Haut").textContent);
  buttonMappings.DOWN = tryArrow(document.getElementById("Bas").textContent);
  buttonMappings.LEFT = tryArrow(document.getElementById("Gauche").textContent);
  buttonMappings.RIGHT = tryArrow(
    document.getElementById("Droite").textContent
  );
  buttonMappings.B = tryArrow(document.getElementById("B").textContent);
  buttonMappings.A = tryArrow(document.getElementById("A").textContent);
  buttonMappings.X = tryArrow(document.getElementById("X").textContent);
  buttonMappings.Y = tryArrow(document.getElementById("Y").textContent);
  modal.style.display = "none";
});

//Changer les input a l'ouverture de la modal
function changeInput() {
  document.getElementById("Haut").textContent = tryArrowDisplay(
    buttonMappings.UP
  );
  document.getElementById("Bas").textContent = tryArrowDisplay(
    buttonMappings.DOWN
  );
  document.getElementById("Gauche").textContent = tryArrowDisplay(
    buttonMappings.LEFT
  );
  document.getElementById("Droite").textContent = tryArrowDisplay(
    buttonMappings.RIGHT
  );
  document.getElementById("B").textContent = tryArrowDisplay(buttonMappings.B);
  document.getElementById("A").textContent = tryArrowDisplay(buttonMappings.A);
  document.getElementById("X").textContent = tryArrowDisplay(buttonMappings.X);
  document.getElementById("Y").textContent = tryArrowDisplay(buttonMappings.Y);
}

//Ouvrir la modal
svgTrigger.addEventListener("click", function () {
  modal.style.display = "block";
  changeInput();
});

//Changer les input au click
function assignKey(buttonId) {
  let button = document.getElementById(buttonId);
  button.addEventListener("click", function () {
    button.textContent = "En attente";
    let onKeyPress = function (event) {
      button.textContent = tryArrowDisplay(event.key);
      document.removeEventListener("keydown", onKeyPress);
    };
    document.addEventListener("keydown", onKeyPress);
  });
}

assignKey("A");
assignKey("B");
assignKey("X");
assignKey("Y");
assignKey("Haut");
assignKey("Bas");
assignKey("Gauche");
assignKey("Droite");

const keyMap = {
  config1: {
    Haut: "ArrowUp",
    Bas: "ArrowDown",
    Gauche: "ArrowLeft",
    Droite: "ArrowRight",
    B: "a",
    A: "z",
    X: "s",
    Y: "d",
  },
  config2: {
    Haut: "z",
    Bas: "q",
    Gauche: "s",
    Droite: "d",
    B: "ArrowUp",
    A: "ArrowDown",
    X: "ArrowLeft",
    Y: "ArrowRight",
  },
  config3: {
    Haut: "ArrowUp",
    Bas: "ArrowDown",
    Gauche: "ArrowLeft",
    Droite: "ArrowRight",
    B: "z",
    A: "q",
    X: "s",
    Y: "d",
  },
};

function setConfig(config) {
  const keys = Object.keys(keyMap[config]);
  keys.forEach((key) => {
    const value = keyMap[config][key];
    document.getElementById(key).textContent = value;
  });
}

config1.addEventListener("click", () => setConfig("config1"));
config2.addEventListener("click", () => setConfig("config2"));
config3.addEventListener("click", () => setConfig("config3"));

/*-----------------------SOCKET-----------------------*/

// Chat affichage
const messageShow = (text, user, you) => {
  const parent = document.querySelector("#msg");
  const chat = document.createElement("li");
  chat.innerHTML = text;
  chat.setAttribute("id", you ? "me" : "other");
  if (!you) {
    const name = document.createElement("li");
    name.setAttribute("id", "name");
    name.innerHTML = user.name;
    parent.appendChild(name);
  }
  parent.appendChild(chat);
  parent.scrollTop = parent.scrollHeight;
};

// Liste des joueurs affichage
const playerJoin = (user, number) => {
  document.querySelector("#" + "player" + number).innerHTML = user;
};

// Admin création du bouton start
const adminBtn = (admin) => {
  if (admin) {
    //create a btn start game
    const start = document.createElement("button");
    start.setAttribute("id", "startbtn");
    start.innerHTML = "Start";
    document.querySelector("#start").appendChild(start);
    //lanch a function when the btn is clicked
    start.addEventListener("click", (e) => {
      e.preventDefault();
      sock.emit("start", roomData.roomName);
      //remove the btn
      document.querySelector("#startbtn").remove();
    });
  } else {
    if (document.querySelector("#startbtn"))
      document.querySelector("#startbtn").remove();
  }
};

// Conditionner l'affichage en fonction de l'état de l'utilisateur
const generateParametersAdmin = (admin) => {
  const container = document.getElementById("adminParam");
  container.innerHTML = "";
  if (admin) {
    container.innerHTML = HTMLADMIN;
    document
      .getElementById("btnPositionGauche")
      .addEventListener("click", () => {
        let tabValue = ["Fixe", "Hasard"];
        changeTexte("textPosition", tabValue, "position");
      });

    document
      .getElementById("btnPositionDroite")
      .addEventListener("click", () => {
        let tabValue = ["Fixe", "Hasard"];
        changeTexte("textPosition", tabValue, "position");
      });

    document.getElementById("btnMapGauche").addEventListener("click", () => {
      sock.emit("changeMap", -1, roomData.roomName);
    });

    document.getElementById("btnMapDroite").addEventListener("click", () => {
      sock.emit("changeMap", 1, roomData.roomName);
    });
  } else {
    container.innerHTML = HTMLPLAYER;
  }
};

// Envoie du chat
const onChatSubmitted = (sock) => (e) => {
  e.preventDefault();
  const input = document.querySelector("#chat-input") as HTMLInputElement;
  const text = input.value;
  input.value = "";
  sock.emit("message", text, roomData.roomName);
};

// Choisir son nom et sa room
const onUsernameSubmitted = (sock) => (e) => {
  e.preventDefault();
  const name = document.querySelector("#usernameInput") as HTMLInputElement;
  const room = document.querySelector("#roomInput") as HTMLInputElement;
  if (name.value.trim() == "") {
    document.querySelector("#error").innerHTML =
      "Veuillez rentrer un nom valide !";
    name.value = "";
  } else {
    const param2 = JSON.stringify({ name: name.value, room: room.value });
    const param = JSON.parse(param2);
    name.value = ""; // clear the name field
    room.value = ""; // clear the room field
    document.getElementById("modal").style.display = "none";
    sock.emit("joinRoom", param);
    canvas.focus();
  }
};

// Ajoute un joueur à notre partie
const addPlayer = (param) => {
  const character = new Player(param);
  characters[param.id] = character;
  playerJoin(param.name, param.playerNumber);
};

const removeCharacter = (id) => {
  if (characters[id]) {
    document.querySelector("#player" + characters[id].playerNumber).innerHTML =
      "-";
    delete characters[id];
  }
};

const changeMap = (param, index) => {
  roomData.mapParameter = param;
  const mapImage = document.getElementById("map") as HTMLImageElement;
  mapImage.src = `img/map-icon/Map-${index + 1}.png`;
  mapImage.alt = `Map-${index + 1}`;
  document.getElementById("tooltiptext2").innerHTML = param.tooltip;
  document.getElementById("mapTxt").innerHTML = param.name;
};

const playerDied = (id) => {
  const playerElement = document.querySelector(
    "#player" + characters[id].playerNumber
  ) as HTMLElement;
  playerElement.setAttribute(
    "style",
    "font-style: italic; text-decoration: line-through;"
  );
};

// Ajoute les paramètres de la partie
const addParam = (param, indexMap) => {
  roomData = param;
  document.getElementById(
    "canvas"
  ).style.backgroundImage = `url(img/map/${param.mapParameter.source})`;
  wallUnbreakableImage.src = `img/map/${param.mapParameter.wall}`;
  (document.getElementById("tooltiptext2") as HTMLElement).innerHTML =
    param.mapParameter.tooltip;
  (
    document.getElementById("map") as HTMLImageElement
  ).src = `img/map-icon/Map-${indexMap + 1}.png`;
  (document.getElementById("map") as HTMLImageElement).alt = `Map-${
    indexMap + 1
  }`;
  document.getElementById("mapTxt").innerHTML = param.mapParameter.name;
};

const addWalls = (param) => {
  walls = param;
};

// Ajoute une bombe à notre partie
const addBomb = (param) => {
  const newBomb = {
    x: param.x,
    y: param.y,
    bombType: param.bombType,
  };
  let bomb = new Bomb(newBomb);
  bombs[param.id] = bomb;
};

// Ajoute une explosion à notre partie
const addExplosion = (param) => {
  for (let id in param) {
    const newExplosion = {
      x: param[id].x,
      y: param[id].y,
    };
    explosions[id] = newExplosion;
  }
};

// Ajoute un item
const addItem = (param, id) => {
  const newItem = {
    x: param.x,
    y: param.y,
    type: param.type,
  };
  items[id] = newItem;
};

// Lance la partie
const startgame = (param) => {
  roomData.gameStarted = param;
};

// Met à jour la position d'un joueur sur le canvas
const updateCharacterPosition = (param) => {
  const character = characters[param.id];
  character.lastMove = param.lastMove;

  if (param.direction === "left" && character.frameY != 5) {
    character.frameY = 5;
    character.frameCount = 6;
    character.frameX = 0;
  } else if (param.direction === "right" && character.frameY != 6) {
    character.frameY = 6;
    character.frameCount = 6;
    character.frameX = 0;
  } else if (param.direction === "up" && character.frameY != 7) {
    character.frameY = 7;
    character.frameCount = 6;
    character.frameX = 0;
  } else if (param.direction === "down" && character.frameY != 4) {
    character.frameY = 4;
    character.frameCount = 6;
    character.frameX = 0;
  }

  character.x = param.x;
  character.y = param.y;
};

const updateSpeed = (speed, playerId) => {
  const character = characters[playerId];
  character.speed = speed;
};

const updateBomb = (bombParam, id) => {
  const bomb = bombs[id];
  bomb.x = bombParam.x;
  bomb.y = bombParam.y;
};

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
//-----------------------LAUNCH-----------------------
(() => {
  //-----------------------GET-----------------------

  sock.on("message", messageShow); //quand le client recois un message

  sock.on("adminBtn", adminBtn);

  sock.on("isAdmin", generateParametersAdmin);

  sock.on("updateCharacterPosition", updateCharacterPosition); //met a jour la position du joueur

  sock.on("addCharacter", addPlayer);

  sock.on("removeCharacter", removeCharacter);

  sock.on("updateSpeed", updateSpeed);

  sock.on("changeMap", changeMap);

  sock.on("playerDied", playerDied);

  sock.on("addParam", addParam);

  sock.on("addWalls", addWalls);

  sock.on("addBomb", addBomb);

  sock.on("updateBomb", updateBomb);

  sock.on("addItem", addItem);

  sock.on("addExplosion", addExplosion);

  sock.on("start", startgame);

  sock.on("bombExploded", function (id) {
    delete bombs[id];
  }); // listen for a bomb to explode

  sock.on("explosionEnded", function (id) {
    delete explosions[id];
  }); // listen for an explosion to end

  sock.on("itemPicked", function (id) {
    delete items[id];
  }); // listen for an item to be picked

  //-----------------------SEND-----------------------
  // Envoyer un message
  document
    .querySelector("#chat-send")
    .addEventListener("submit", onChatSubmitted(sock));

  // Envoyer le nom et la room
  document
    .querySelector("#username_form")
    .addEventListener("submit", onUsernameSubmitted(sock));
})();

/*----------------------LISTERNER----------------------- */

// Si on appuie sur une touche
canvas.addEventListener("keydown", function (e) {
  keys[e.key] = true;
  if (
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab"].indexOf(e.code) >
    -1
  )
    e.preventDefault();
});

//si on relache la touche
canvas.addEventListener("keyup", function (e) {
  delete keys[e.key];
});

/*-----------------------DRAW-----------------------*/

const drawCharacters = () => {
  // Dessinez chaque personnage
  for (const id in characters) {
    const character = characters[id];
    if (character.alive) {
      // ctx.fillStyle = "red";
      // ctx.fillRect(character.x, character.y, 16, 16);
      //drawimage

      ctx.drawImage(
        playerSprite[character.playerNumber - 1],
        0,
        0,
        16,
        16,
        character.x,
        character.y,
        16,
        16
      );

      ctx.drawImage(
        playerSprite[character.playerNumber - 1],
        0 + character.frameX * 20,
        30 + character.frameY * 30,
        20,
        30,
        character.x - 2,
        character.y - 18,
        20,
        30
      );
    }
  }
};

function drawWalls() {
  for (let i = 0; i < walls.length; i++) {
    // afficher avec des sprites plutot que des rectangles de bombSprite
    let wall = walls[i];
    wall.destructible &&
      ctx.drawImage(
        wallSprite,
        0,
        20 * roomData.mapParameter.wallType - 20 + 4,
        16,
        16,
        wall.x,
        wall.y,
        wall.width,
        wall.height
      );
  }
}

function drawWallsUp() {
  for (let i = 0; i < walls.length; i++) {
    // afficher avec des sprites plutot que des rectangles de bombSprite
    let wall = walls[i];
    wall.destructible &&
      ctx.drawImage(
        wallSprite,
        0,
        20 * roomData.mapParameter.wallType - 20,
        16,
        4,
        wall.x,
        wall.y - 4,
        wall.width,
        4
      );
  }
}

function drawExplosions() {
  for (const id in explosions) {
    ctx.fillStyle = "#FF00FF";
    const explosion = explosions[id];
    ctx.fillRect(explosion.x, explosion.y, 16, 16);
    //mettre en gras
    ctx.font = "bold 8px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("E", explosion.x + 5, explosion.y + 10);
  }
}

function drawBombs() {
  for (const id in bombs) {
    //display image bomb de items image
    const bomb = bombs[id];
    ctx.drawImage(
      bombSprite,
      0 + 16 * bomb.frameX,
      16 * bomb.frameY,
      16,
      16,
      bomb.x,
      bomb.y - 4,
      16,
      16
    );
  }
}

function drawItems() {
  for (const id in items) {
    const item = items[id];
    const itemTypes = {
      fire: 1,
      fireMax: 2,
      fireLow: 3,
      speed: 4,
      slow: 5,
      bomb: 6,
      bombLess: 7,
    };
    ctx.drawImage(
      itemsSprite,
      16 * itemTypes[item.type] - 16,
      0,
      16,
      16,
      item.x,
      item.y - 4,
      16,
      16
    );
  }
}

function drawCarpet() {
  for (let i = 0; i < tapis.length; i++) {
    ctx.fillStyle = "purple";
    let carpetTile = tapis[i];
    ctx.fillRect(carpetTile.x, carpetTile.y, 16, 16);
  }
}

// Dessiner le jeu à chaque frame (60 fois par seconde)
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCarpet();
  drawWalls();
  drawItems();
  drawBombs();
  drawExplosions();
  drawCharacters();
  drawWallsUp();
  ctx.drawImage(wallUnbreakableImage, 0, 0, 256, 384);
}

/*--------------------------BOMBE--------------------------- */
function placeBomb() {
  //Centrer la bombe sur la grille
  let x =
    Math.round((characters[sock.id].x + MAP.startLeft) / 16) * 16 -
    MAP.startLeft;
  let y =
    Math.round((characters[sock.id].y + MAP.startTop) / 16) * 16 - MAP.startTop;

  // Bombes déjà posées
  for (const id in bombs) {
    const bomb = bombs[id];
    if (bomb.x == x && bomb.y == y) {
      return;
    }
  }

  // Envoyer la position de la bombe au serveur
  sock.emit("addBomb", {
    room: roomData.roomName,
    x: x,
    y: y,
  });
}

/*--------------------------CHECK BUTTON--------------------------- */

// Vérifier si le joueur appuie sur l'une des touches fléchées.
function checkArrowKeys(keys) {
  return (
    buttonMappings.UP in keys ||
    buttonMappings.DOWN in keys ||
    buttonMappings.LEFT in keys ||
    buttonMappings.RIGHT in keys
  );
}

function checkButtonKeys(keys) {
  return (
    buttonMappings.A in keys ||
    buttonMappings.B in keys ||
    buttonMappings.X in keys ||
    buttonMappings.Y in keys
  );
}

function typeOfButton(keyObj) {
  let lastKeyPressed = null;
  Object.keys(keys)
    .filter((key) => keys[key])
    .reverse()
    .forEach((key) => {
      if (lastKeyPressed === null && keyObj.includes(key)) {
        lastKeyPressed = key;
      }
    });
  return lastKeyPressed;
}

/*--------------------------ACTION DU JOUEUR--------------------------- */

//Déplacer le joueur
function movePlayer() {
  const lastFourKeys = Object.values(buttonMappings).slice(-4);

  let lastKeyPressed = typeOfButton(lastFourKeys);
  // Click sur une touche
  if (lastKeyPressed === buttonMappings.LEFT) {
    sock.emit("movePlayer", { roomName: roomData.roomName }, "left");
  } else if (lastKeyPressed === buttonMappings.RIGHT) {
    sock.emit("movePlayer", { roomName: roomData.roomName }, "right");
  } else if (lastKeyPressed === buttonMappings.UP) {
    sock.emit("movePlayer", { roomName: roomData.roomName }, "up");
  } else if (lastKeyPressed === buttonMappings.DOWN) {
    sock.emit("movePlayer", { roomName: roomData.roomName }, "down");
  }
}

//Click sur les autres boutons
function pushButton() {
  const firstFourKeys = Object.values(buttonMappings).slice(0, 4);

  let lastKeyPressed = typeOfButton(firstFourKeys);

  if (lastKeyPressed === buttonMappings.A || lastKeyPressed === " ") {
    placeBomb();
    sock.emit("pushA", { roomName: roomData.roomName });
  } else if (lastKeyPressed === buttonMappings.B) {
    sock.emit("pushB", { roomName: roomData.roomName });
  } else if (lastKeyPressed === buttonMappings.X) {
    sock.emit("pushX", { roomName: roomData.roomName });
  } else if (lastKeyPressed === buttonMappings.Y) {
    sock.emit("pushY", { roomName: roomData.roomName });
  }
}

/*---------------------------BOUCLE INFINI--------------------------- */
let updateTime = 0;
let drawTime1 = 0;
let moveCarpet = 0;
let sprite = 0;
let keysTime = 0;

function animate(currentTime) {
  // Calculer le temps écoulé depuis la dernière exécution de la fonction animate()
  //if (roomData.gameStarted) {
  const deltaTime = currentTime - updateTime;
  const deltaTime2 = currentTime - drawTime1;
  const deltaTime3 = currentTime - moveCarpet;
  const deltaTime4 = currentTime - sprite;
  const deltaTime5 = currentTime - keysTime;

  // Update le sprite toutes les 100ms
  if (deltaTime4 >= 150) {
    //PLAYER
    for (const id in characters) {
      const character = characters[id];
      character.updateSprite();
    }
    //BOMB
    for (const id in bombs) {
      const bomb = bombs[id];
      bomb.updateSprite();
    }
    sprite = currentTime;
  }

  if (characters[sock.id]) {
    if (deltaTime >= characters[sock.id].getSpeed) {
      if (checkArrowKeys(keys)) {
        movePlayer();
      }
      updateTime = currentTime;
    }
  }

  // Dessiner sur le canvas toutes les 8ms
  if (deltaTime2 >= 16) {
    drawGame();
    drawTime1 = currentTime;
  }

  if (deltaTime5 >= 100) {
    if (checkButtonKeys(keys)) {
      pushButton();
      keysTime = currentTime;
    }
  }

  // Déplacer le tapis toutes les 75ms - A mettre sur le serveur
  if (characters[sock.id]) {
    if (deltaTime3 >= 75) {
      moveCarpet = currentTime;
      for (let i = 0; i < tapis.length; i++) {
        let carpetTile = tapis[i];
        if (
          characters[sock.id].x < carpetTile.x + 8 &&
          characters[sock.id].x + 8 >= carpetTile.x &&
          characters[sock.id].y < carpetTile.y + 8 &&
          characters[sock.id].y + 8 >= carpetTile.y
        ) {
          carpetTile.direction == "right" &&
            characters[sock.id].move(+1, 0, walls, bombs);
          carpetTile.direction == "left" &&
            characters[sock.id].move(-1, 0, walls, bombs);
          carpetTile.direction == "down" &&
            characters[sock.id].move(0, +1, walls, bombs);
          carpetTile.direction == "top" &&
            characters[sock.id].move(0, -1, walls, bombs);
        }

        //si il y a une bombe sur le tapis
        for (const id in bombs) {
          const bomb = bombs[id];
          if (
            bomb.x < carpetTile.x + 8 &&
            bomb.x + 8 >= carpetTile.x &&
            bomb.y < carpetTile.y + 8 &&
            bomb.y + 8 >= carpetTile.y
          ) {
            if (carpetTile.direction == "right") {
              bomb.y == carpetTile.y ? (bomb.x += 1) : (bomb.y -= 1);
            }
            if (carpetTile.direction == "left") {
              bomb.y == carpetTile.y ? (bomb.x -= 1) : (bomb.y += 1);
            }
            if (carpetTile.direction == "down") {
              bomb.x == carpetTile.x ? (bomb.y += 1) : (bomb.x += 1);
            }
            if (carpetTile.direction == "top") {
              bomb.x == carpetTile.x ? (bomb.y -= 1) : (bomb.x -= 1);
            }
          }
        }
      }
    }
  }
  // Appeler à nouveau la fonction animate() pour continuer l'animation
  requestAnimationFrame(animate);
}

// Lancer l'animation en appelant la fonction animate()
requestAnimationFrame(animate);
