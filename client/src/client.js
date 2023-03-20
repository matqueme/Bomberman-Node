import Player from "./player.js";
import { WALL } from "./const.js";

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

//numero de la room
let roomnumber = "";

const keys = {};

let characters = {};

let bombs = {};

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
  for (let i = 0; i < 8; i++) {}
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

//ecrire le nom du player qui vient de rejoindre
const playerJoin = (user, number) => {
  document.querySelector("#" + "player" + number).innerHTML = user;
};

//btn start
const admin = (admin) => {
  if (admin) {
    document.querySelector("#start").disabled = false;
  }
};

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
// const displayRadioValue = (sock) => (e) => {
//   e.preventDefault();
//   var ele = document.getElementsByName("player");
//   for (let i = 0; i < ele.length; i++) {
//     if (ele[i].checked) {
//       sock.emit("changePlayerNumber", i + 1);
//     }
//   }
// };

const onStart = (sock) => (e) => {
  e.preventDefault();
  sock.emit("start");
};

//ajoute un player dans le tableau
const addPlayer = (param) => {
  const character = new Player(param);
  characters[param.id] = character;
  playerJoin(param.name, param.playerNumber);
};

const addBomb = (param) => {
  const newBomb = {
    x: param.x,
    y: param.y,
  };
  bombs[param.id] = newBomb;
};

const updateCharacterPosition = (param) => {
  const character = characters[param.id];
  character.x = param.x;
  character.y = param.y;
};

const sock = io();
//---------LAUNCH----------
(() => {
  //------------GET------------

  sock.on("message", messageShow); //quand le client recois un message

  sock.on("updateUserList", userList);

  sock.on("admin", admin);

  sock.on("updateCharacterPosition", updateCharacterPosition); //met a jour la position du joueur

  sock.on("addCharacter", addPlayer);

  sock.on("addBomb", addBomb);

  sock.on("bombExploded", function (id) {
    delete bombs[id];
  }); // listen for a bomb to explode

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
});

//si on relache la touche
window.addEventListener("keyup", function (e) {
  delete keys[e.key];
});

//wall
let walls = WALL.wall;

const drawCharacters = () => {
  // Dessinez chaque personnage
  for (const id in characters) {
    const character = characters[id];
    ctx.fillStyle = "red";
    ctx.fillRect(character.x, character.y, 16 * 4, 16 * 4);
  }
};

function drawWalls() {
  ctx.fillStyle = "gray";
  for (let i = 0; i < walls.length; i++) {
    let wall = walls[i];
    ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
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

// Définissez une fonction pour effacer le canvas et dessiner le jeu
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBomb();
  drawWalls();
  drawCharacters();
}

let updateTime = 0;
let drawTime1 = 0;

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

/*--------------------------MOUVEMENT DU PERSONNAGE--------------------------- */

//deplacement du joueur + changement de la frame pour sa position + changement de son statue moving ou pas
function movePlayer() {
  const speed = 4; // 1px sur le jeu = 4px sur le canvas

  let lastKeyPressed = Object.keys(keys)[Object.keys(keys).length - 1];

  if (lastKeyPressed == " " || lastKeyPressed == "Enter") {
    lastKeyPressed = Object.keys(keys)[Object.keys(keys).length - 2];
  }

  //quand on click sur les touches
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

/*--------------------------BOMBE--------------------------- */
function placeBomb() {
  sock.emit("addBomb", {
    room: roomnumber,
    x: characters[sock.id].x,
    y: characters[sock.id].y,
  });
}

/*----------------------------------BOMBE-----------------------------------*/

// /*-----------------WALL------------------- */

/*-----------------------------TIME------------------------- */

/*--------------------------BOUCLE INFINI------------------------------- */

function animate2(currentTime) {
  // Calculer le temps écoulé depuis la dernière exécution de la fonction animate()
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
        room: roomnumber,
        x: characters[sock.id].x,
        y: characters[sock.id].y,
      });
    }
  }

  // Appeler à nouveau la fonction animate() pour continuer l'animation
  requestAnimationFrame(animate2);
}

// Lancer l'animation en appelant la fonction animate()
requestAnimationFrame(animate2);
