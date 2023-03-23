import Player from "./player.js";
import { WALL } from "./const.js";
import { MAP } from "./const.js";

/*-----------------------CONSTANTE-----------------------*/

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

const keys = {};

let characters = {};

let walls = WALL.wall;

let bombs = {};

let explosions = {};

let roomData = {};

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
const admin = (admin) => {
  if (admin) {
    //create a btn start game
    const start = document.createElement("button");
    start.setAttribute("id", "startbtn");
    start.innerHTML = "Start";
    document.querySelector("#start").appendChild(start);
    //lanch a function when the btn is clicked
    start.addEventListener("click", (e) => {
      e.preventDefault();
      sock.emit("start", roomData.nameroom);
      //remove the btn
      document.querySelector("#startbtn").remove();
    });
  } else {
    if (document.querySelector("#startbtn"))
      document.querySelector("#startbtn").remove();
  }
};

// Envoie du chat
const onChatSubmitted = (sock) => (e) => {
  e.preventDefault();
  const input = document.querySelector("#chat-input");
  const text = input.value;
  input.value = "";
  sock.emit("message", text, roomData.nameroom);
};

// Choisir son nom et sa room
const onUsernameSubmitted = (sock) => (e) => {
  e.preventDefault();
  const name = document.querySelector("#usernameInput");
  const room = document.querySelector("#roomInput");
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

const playerDied = (id) => {
  characters[id].alive = false;
  //Set the player name en italique et barré
  document.querySelector("#player" + characters[id].playerNumber).style =
    "font-style: italic; text-decoration: line-through;";
};

// Ajoute les paramètres de la partie
const addParam = (param) => {
  roomData = param;
};

// Ajoute une bombe à notre partie
const addBomb = (param) => {
  const newBomb = {
    x: param.x,
    y: param.y,
  };
  bombs[param.id] = newBomb;
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

// Lance la partie
const startgame = (param) => {
  roomData.gameStarted = param;
  console.log(roomData);
};

// Met à jour la position d'un joueur
const updateCharacterPosition = (param) => {
  const character = characters[param.id];
  character.x = param.x;
  character.y = param.y;
};

const sock = io();
//-----------------------LAUNCH-----------------------
(() => {
  //-----------------------GET-----------------------

  sock.on("message", messageShow); //quand le client recois un message

  sock.on("admin", admin);

  sock.on("updateCharacterPosition", updateCharacterPosition); //met a jour la position du joueur

  sock.on("addCharacter", addPlayer);

  sock.on("removeCharacter", removeCharacter);

  sock.on("playerDied", playerDied);

  sock.on("addParam", addParam);

  sock.on("addBomb", addBomb);

  sock.on("addExplosion", addExplosion);

  sock.on("start", startgame);

  sock.on("bombExploded", function (id) {
    delete bombs[id];
  }); // listen for a bomb to explode

  sock.on("explosionEnded", function (id) {
    delete explosions[id];
  }); // listen for an explosion to end

  //-----------------------SEND-----------------------
  // Page de chat - Envoyer un message
  document
    .querySelector("#chat-send")
    .addEventListener("submit", onChatSubmitted(sock));

  // Page de connexion - Envoyer le nom et la room
  document
    .querySelector("#username_form")
    .addEventListener("submit", onUsernameSubmitted(sock));
})();

/*----------------------LISTERNER----------------------- */

// Si on appuie sur une touche
window.addEventListener("keydown", function (e) {
  keys[e.key] = true;
  if (
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab"].indexOf(e.code) >
    -1
  )
    e.preventDefault();
});

//si on relache la touche
window.addEventListener("keyup", function (e) {
  delete keys[e.key];
});

/*-----------------------DRAW-----------------------*/

const drawCharacters = () => {
  // Dessinez chaque personnage
  for (const id in characters) {
    const character = characters[id];
    if (character.alive) {
      ctx.fillStyle = "red";
      ctx.fillRect(character.x, character.y, 16 * 4, 16 * 4);
    }
  }
};

function drawWalls() {
  ctx.fillStyle = "gray";
  for (let i = 0; i < walls.length; i++) {
    let wall = walls[i];
    ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
  }
}

function drawExplosion() {
  for (const id in explosions) {
    ctx.fillStyle = "#FF00FF";
    const explosion = explosions[id];
    ctx.fillRect(explosion.x, explosion.y, 16 * 4, 16 * 4);
    //mettre en gras
    ctx.font = "bold 35px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("E", explosion.x + 20, explosion.y + 40);
  }
}

function drawBomb() {
  for (const id in bombs) {
    ctx.fillStyle = "blue";
    const bomb = bombs[id];
    ctx.fillRect(bomb.x, bomb.y, 16 * 4, 16 * 4);
    //mettre en gras
    ctx.font = "bold 35px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("B", bomb.x + 20, bomb.y + 40);
  }
}

// Dessiner le jeu à chaque frame (60 fois par seconde)
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBomb();
  drawWalls();
  drawExplosion();
  drawCharacters();
}

/*--------------------------MOUVEMENT DU PERSONNAGE--------------------------- */

// Vérifier si le joueur appuie sur l'une des touches fléchées.
function checkArrowKeys(keys) {
  return (
    keys["ArrowUp"] ||
    keys["ArrowDown"] ||
    keys["ArrowLeft"] ||
    keys["ArrowRight"] ||
    keys["z"] ||
    keys["q"] ||
    keys["s"] ||
    keys["d"]
  );
}

/*--------------------------BOMBE--------------------------- */
function placeBomb() {
  //Centrer la bombe sur la grille
  let x =
    Math.round((characters[sock.id].x + MAP.startLeft) / 64) * 64 -
    MAP.startLeft;
  let y =
    Math.round((characters[sock.id].y + MAP.startTop) / 64) * 64 - MAP.startTop;

  // Bombes déjà posées
  for (const id in bombs) {
    const bomb = bombs[id];
    if (bomb.x == x && bomb.y == y) {
      return;
    }
  }

  // Envoyer la position de la bombe au serveur
  sock.emit("addBomb", {
    room: roomData.nameroom,
    x: x,
    y: y,
  });
}

//Déplacer le joueur
function movePlayer() {
  const speed = 4; // 1px sur le jeu = 4px sur le canvas

  let lastKeyPressed = Object.keys(keys)[Object.keys(keys).length - 1];

  if (lastKeyPressed == " " || lastKeyPressed == "Enter") {
    lastKeyPressed = Object.keys(keys)[Object.keys(keys).length - 2];
  }

  // Click sur une touche
  if (lastKeyPressed == "ArrowLeft" || lastKeyPressed == "q") {
    characters[sock.id].move(-speed, 0, walls);
  } else if (lastKeyPressed == "ArrowRight" || lastKeyPressed == "d") {
    characters[sock.id].move(+speed, 0, walls);
  } else if (lastKeyPressed == "ArrowUp" || lastKeyPressed == "z") {
    characters[sock.id].move(0, -speed, walls);
  } else if (lastKeyPressed == "ArrowDown" || lastKeyPressed == "s") {
    characters[sock.id].move(0, +speed, walls);
  }
  if (keys[" "] || keys["Enter"]) {
    placeBomb();
  }
}

/*---------------------------WALL--------------------------- */

/*---------------------------TIME--------------------------- */

/*---------------------------BOUCLE INFINI--------------------------- */
let updateTime = 0;
let drawTime1 = 0;

function animate(currentTime) {
  // Calculer le temps écoulé depuis la dernière exécution de la fonction animate()
  //if (roomData.gameStarted) {
  const deltaTime = currentTime - updateTime;
  const drawTime = currentTime - drawTime1;

  if (characters[sock.id]) {
    // Mettre à jour la position des utilisateurs toutes les 12ms
    if (deltaTime >= characters[sock.id].getSpeed) {
      if (checkArrowKeys(keys) || keys[" "] || keys["Enter"]) {
        movePlayer();
      }
      updateTime = currentTime;
    }
  }

  // Dessiner sur le canvas toutes les 8ms
  if (drawTime >= 16) {
    drawGame();
    drawTime1 = currentTime;
    // Si le joueur a bouger on envoie la position
    if (checkArrowKeys(keys)) {
      // Envoyer au serveur la position du joueur
      sock.emit("updateCharacterPosition", {
        room: roomData.nameroom,
        x: characters[sock.id].x,
        y: characters[sock.id].y,
      });
    }
  }
  //}

  // Appeler à nouveau la fonction animate() pour continuer l'animation
  requestAnimationFrame(animate);
}

// Lancer l'animation en appelant la fonction animate()
requestAnimationFrame(animate);
