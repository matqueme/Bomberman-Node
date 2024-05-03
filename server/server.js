import http from "http";
import express from "express";
import { Server } from "socket.io";
import Bomb from "./bomb.js";
import Explosion from "./explosion.js";
import Wall from "./wall.js";
import Player from "./player.js";
//calculer le temps d'import

import {
  ROOMDEFAULT,
  MAP,
  MAPS,
  PLAYERSTARTPOSITIONS,
  CENTEROBJECTS,
  CARPET,
  CARPET2,
  TRAPDOOR,
  ARROWGROUND1,
  BALANCOIRE,
  PLAYERSTARTPOSITIONSMINI,
  ARROWGROUND2,
} from "./const.js";

const app = express();

app.use(express.static("../client"));

const server = http.createServer(app);
const io = new Server(server);

const rooms = {};

io.on("connection", (socket) => {
  //CONNECTION
  socket.on("joinRoom", (param) => {
    console.log("------------------");
    let roomName = param.room;
    // Rejoindre la room
    socket.join(param.room);
    console.log(
      `Client connected: ${socket.id}, name : ${param.name}, to room : "${roomName}"`
    );

    // Création d'une nouvelle room
    if (!rooms[roomName]) {
      rooms[roomName] = { ...ROOMDEFAULT };
      rooms[roomName].roomData.mapParameter = MAPS[0];
      rooms[roomName].roomData.roomName = roomName;
    }

    //Si il y a plus de 8 joueurs dans la room ou si la partie a commencé
    if (
      Object.keys(rooms[roomName].players).length >= 8 ||
      rooms[roomName].roomData.gameStarted
    )
      return;

    //creation du numero de joueur le plus petit disponible
    let smallestPlayerNumber = 1;
    const usedNumbers = new Set(
      Object.values(rooms[roomName].players).map(
        (player) => player.playerNumber
      )
    );
    while (usedNumbers.has(smallestPlayerNumber)) {
      smallestPlayerNumber++;
    }

    // Si il n'y a aucun joueur dans la room on le met en admin
    rooms[roomName].players[socket.id] = new Player(
      socket.id,
      param.name,
      PLAYERSTARTPOSITIONS["player" + smallestPlayerNumber][0].x,
      PLAYERSTARTPOSITIONS["player" + smallestPlayerNumber][0].y,
      Object.keys(rooms[roomName].players).length == 0,
      smallestPlayerNumber
    );

    if (Object.keys(rooms[roomName].players).length >= 2) {
      adminStartBtn(true, roomName);
    }

    // Envoyer ses informations au joueur qui vient de rejoindre
    for (let id in rooms[roomName].players) {
      io.to(socket.id).emit("addCharacter", rooms[roomName].players[id]);
    }

    io.to(socket.id).emit("isAdmin", rooms[roomName].players[socket.id].admin);

    io.to(socket.id).emit(
      "addParam",
      rooms[roomName].roomData,
      MAPS.indexOf(rooms[roomName].roomData.mapParameter)
    );

    io.to(socket.id).emit("addWalls", rooms[roomName].walls);

    // Envoyer les informations du nouveau joueur aux autres joueurs
    socket.broadcast.emit("addCharacter", rooms[roomName].players[socket.id]);
  });

  //CHAT
  socket.on("message", (text, room) => {
    let user = rooms[room].players[socket.id];
    if (text && user) {
      socket.broadcast.to(room).emit("message", text, user, 0);
      io.to(socket.id).emit("message", text, user, 1);
    }
  }); //envoie un message a tt le monde meme l'utilisateur

  //CHANGE LE JOUEUR -------------------
  socket.on("changePlayerNumber", (param) => { });

  socket.on("movePlayer", (data, direction) => {
    let roomName = data.roomName;
    let dx = 0,
      dy = 0;
    if (direction == "left") dx = -1;
    else if (direction == "right") dx = 1;
    else if (direction == "up") dy = -1;
    else if (direction == "down") dy = 1;

    // Mettre à jour la position du joueur
    let returnfct = rooms[roomName].players[socket.id].move(
      dx,
      dy,
      rooms[roomName].walls,
      rooms[roomName].bombs
    );

    // Envoyer les informations de mise à jour a tout les joueurs
    io.to(roomName).emit("updateCharacterPosition", {
      id: socket.id,
      x: rooms[roomName].players[socket.id].x,
      y: rooms[roomName].players[socket.id].y,
      lastMove: Date.now(),
      direction: direction,
    });

    if (returnfct && returnfct !== true) {
      rooms[roomName].bombs[returnfct].changePropertie(dx, dy);
    }
  });

  socket.on("pushA", (data) => {
    let roomName = data.roomName;
    console.log("PushA");
  });

  socket.on("pushB", (data) => {
    let roomName = data.roomName;
    console.log("PushB");
  });

  socket.on("pushX", (data) => {
    let roomName = data.roomName;
    console.log("PushX");
  });

  socket.on("pushY", (data) => {
    let roomName = data.roomName;
    console.log("PushY");
  });

  // Ajouter une bombe
  socket.on("addBomb", (data) => {
    let roomName = data.room;
    if (
      data.x < MAP.startLeft ||
      data.x > MAP.endRight ||
      data.y > MAP.endTop ||
      data.y < MAP.startTop
    )
      return;
    //verifier que l'utilisateur n'a pas déposer son max de bombe
    if (
      Object.keys(rooms[roomName].bombs).filter(
        (bomb) => rooms[roomName].bombs[bomb].owner == socket.id
      ).length >= rooms[roomName].players[socket.id].bombMax
    )
      return;

    let timeToExplode = 3000;
    let bombRange = rooms[roomName].players[socket.id].bombRange;
    let bombType = rooms[roomName].players[socket.id].bombType;

    // Propriétés de la bombe
    if (rooms[roomName].players[socket.id].bombType == 2) {
      timeToExplode = -1;
    } else if (rooms[roomName].players[socket.id].bombType == 4) {
      !Object.values(rooms[roomName].bombs).find(
        (bomb) => bomb.owner == socket.id && bomb.bombType == 4
      )
        ? (bombRange = 8)
        : (bombType = 1);
    } else if (rooms[roomName].players[socket.id].bombType == 5) {
      !Object.values(rooms[roomName].bombs).find(
        (bomb) => bomb.owner == socket.id && bomb.bombType == 5
      )
        ? (timeToExplode = -1)
        : (bombType = 1);
    } else if (rooms[roomName].players[socket.id].bombType == 7) {
      !Object.values(rooms[roomName].bombs).find(
        (bomb) => bomb.owner == socket.id && bomb.bombType == 7
      )
        ? (bombRange = 2)
        : (bombType = 1);
    }

    const bomb = new Bomb(
      data.x,
      data.y,
      rooms[roomName].roomData.nextBombId,
      bombType,
      bombRange,
      timeToExplode,
      socket.id
    );
    // Ajoute la bombe à la liste des bombes de la salle correspondante
    rooms[roomName].bombs[rooms[roomName].roomData.nextBombId] = bomb;

    // Met à jour la variable nextBombId de la salle pour la prochaine bombe
    rooms[roomName].roomData.nextBombId++;

    // Envoie la bombe à tout les joueurs dans la room
    io.to(roomName).emit("addBomb", bomb);

    // bomb.moveBounceSide();
  });

  //--------------------Paramètres--------------------

  socket.on("changeMap", (param, roomName) => {
    if (!rooms[roomName]) return;
    let user = rooms[roomName].players[socket.id];
    if (user.admin) {
      let newIndex =
        MAPS.indexOf(rooms[roomName].roomData.mapParameter) + param;
      if (newIndex < 0) {
        rooms[roomName].roomData.mapParameter = MAPS[MAPS.length - 1];
        newIndex = MAPS.length - 1;
      } else if (newIndex >= MAPS.length) {
        rooms[roomName].roomData.mapParameter = MAPS[0];
        newIndex = 0;
      } else {
        rooms[roomName].roomData.mapParameter = MAPS[newIndex];
      }
      let mapParameter = rooms[roomName].roomData.mapParameter;
      //a mettre au start !!!!!!!!!
      rooms[roomName].walls = generateWallsIndestructible(
        mapParameter.generatioWall
      );
      rooms[roomName].walls.push(
        generateWallsDestructible(mapParameter.generatioWall, roomName)
      );
      rooms[roomName].walls = rooms[roomName].walls.flat();

      io.to(roomName).emit("addWalls", rooms[roomName].walls);

      //send to everyone
      io.to(roomName).emit("changeMap", mapParameter, newIndex);
    }
  });

  //START
  socket.on("start", (room) => {
    //start game
    let user = rooms[room].players[socket.id];
    if (user.admin) {
      rooms[room].roomData.gameStarted = true;
      io.to(room).emit("start", rooms[room].roomData.gameStarted);
    }
  });

  //DECONNECTION
  socket.on("disconnect", () => {
    //supprimer de la room le joueur qui se deconnecte
    Object.keys(rooms).forEach(function (roomName) {
      const room = rooms[roomName];
      if (room.players.hasOwnProperty(socket.id)) {
        console.log("------------------");
        //si le joueur est admin on change l'admin
        if (
          room.players[socket.id].admin &&
          Object.keys(room.players).length > 1
        ) {
          //on met le joueur suivant en admin
          let newAdmin = Object.keys(room.players)[1];
          room.players[newAdmin].admin = true;
          console.log(
            `Le joueur "${room.players[newAdmin].name}" est devenu admin de la room "${roomName}"`
          );
          io.to(newAdmin).emit("isAdmin", true);
        }

        socket.broadcast.emit("removeCharacter", socket.id);

        // On supprime le joueur de la room
        console.log(
          `Le joueur "${room.players[socket.id].name
          }" a été supprimé de la room "${roomName}"`
        );
        delete room.players[socket.id];

        // Si il n'y a plus de joueurs dans la room, on supprime la room
        if (Object.keys(room.players).length === 0) {
          console.log(`La room "${roomName}" a été supprimée`);
          delete rooms[roomName];
        } else {
          // Si il y a plus de 2 joueurs dans la room, on active le bouton de lancement de partie
          Object.keys(room.players).length >= 2
            ? adminStartBtn(true, roomName)
            : adminStartBtn(false, roomName);
        }
      }
    });
  });
});

/*--------------------------BOUTON START------------------------------- */

const adminStartBtn = (isBtn, roomName) => {
  //recuperer l'index du joueur qui est admin
  let index = Object.keys(rooms[roomName].players).find(
    (key) => rooms[roomName].players[key].admin
  );
  // Envoyer les informations d'Admin
  if (rooms[roomName].players[index].admin) {
    io.to(index).emit("adminBtn", isBtn);
  }
};
/*--------------------------Explosion------------------------------- */

function createExplosion(x, y, type, room, date) {
  let newExplosion = new Explosion(
    x,
    y,
    type,
    room.roomData.nextExplosionId,
    date
  );
  // Ajout de l'explosion dans la room
  room.explosions[room.roomData.nextExplosionId] = newExplosion;
  room.roomData.nextExplosionId++;
}

function collideBomb(x, y, room) {
  for (const bombId in room.bombs) {
    const bomb = room.bombs[bombId];
    if (x == bomb.x && y == bomb.y) {
      bomb.timeToExplode = 0;
    }
  }
}

/*--------------------------WALL------------------------------- */

function collideWall(x, y, room) {
  for (let id = 0; id < room.walls.length; id++) {
    const wall = room.walls[id];
    if (x == wall.x && y == wall.y) {
      return true;
    }
  }
  return false;
}

function collideWallGenerate(x, y, wall) {
  for (let id = 0; id < wall.length; id++) {
    if (x + MAP.startLeft == wall[id].x && y + MAP.startTop == wall[id].y) {
      return true;
    }
  }
  return false;
}

function collideWallIndestructible(x, y, room) {
  for (let id = 0; id < room.walls.length; id++) {
    const wall = room.walls[id];
    if (x == wall.x && y == wall.y && !wall.destructible) {
      return true;
    }
  }
  return false;
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Check if the wall is already destroyed
function isWallDestroyed(x, y, room) {
  for (let i = 0; i < room.wallsDestroy.length; i++) {
    if (x == room.wallsDestroy[i].x && y == room.wallsDestroy[i].y) {
      return true;
    }
  }
  return false;
}

// Destructible wall for disable the double destruction of a wall
function wallDestructible(x, y, room) {
  for (let wall of room.walls) {
    if (x == wall.x && y == wall.y && wall.destructible) {
      //generate item
      generateItem(room, wall.x, wall.y);
      //remove the wall
      room.walls.splice(room.walls.indexOf(wall), 1);
      //ajouter le wall dans la liste des walls a supprimer
      room.wallsDestroy.push({
        x: wall.x,
        y: wall.y,
        time: 500,
      });
      //envoyer les nouveaux walls aux joueurs
      io.to(room.roomData.roomName).emit("addWalls", room.walls);
    }
  }
}

/*--------------------------GENERATE WALL------------------------------- */

function isPlayerStart(x, y, type) {
  for (let player in type) {
    for (let position of type[player]) {
      if (x + MAP.startLeft == position.x && y + MAP.startTop == position.y) {
        return true;
      }
    }
  }
  return false;
}

function isObject(x, y, type) {
  for (let object of type) {
    if (x + MAP.startLeft == object.x && y + MAP.startTop == object.y) {
      return true;
    }
  }
  return false;
}

function generateWallSquare() {
  let walls = [];
  for (let i = 0; i < 2; i++) {
    for (let y = 0; y < 144; y += 16) {
      for (let x = 0; x < 240; x += 16) {
        const wall = new Wall(x, y + i * 192, true);
        if (
          x > 16 &&
          x < 208 &&
          y + i * 192 > 16 + i * 192 &&
          y + i * 192 < 112 + i * 192
        ) {
          continue; // Si oui, passe au carré suivant
        }
        if (!isPlayerStart(x, y + i * 192, PLAYERSTARTPOSITIONS))
          walls.push(wall);
      }
    }
  }
  return walls;
}

// Generate walls
function generateWallsDestructible(generatewall, room) {
  let walls = [];
  let wallTotal = 182;
  const valuesToSubtract = {
    2: CENTEROBJECTS.length,
    3: CARPET.length,
    4: TRAPDOOR.length,
    5: ARROWGROUND1.length + CENTEROBJECTS.length,
    6: BALANCOIRE.length + 12,
    7: 182,
    8: 182,
    9: 91,
    12: 60,
    13: 60,
    14: 60 + CARPET2.length,
    15: ARROWGROUND2.length,
  };
  // si generatewall est dans valuesToSubtract, on soustrait la valeur correspondante
  if (valuesToSubtract[generatewall])
    wallTotal -= valuesToSubtract[generatewall];

  // Nombre de murs destructibles
  if (generatewall === 8) {
    walls = generateWallSquare();
  } else if (generatewall === 10) {
    wallTotal += 30;
  }

  const randomRatioWall = getRandomArbitrary(0.65, 0.8);
  const wallDestructible = Math.floor(wallTotal * randomRatioWall);

  while (walls.length < wallDestructible) {
    const x = random(0, 14) * 16;
    const y = random(0, 20) * 16;
    const wall = new Wall(x, y, true);

    const isCenterObject = isObject(x, y, CENTEROBJECTS);
    const isArrowGround = isObject(x, y, ARROWGROUND1);
    const allowedValues = [1, 10, 11, 16, 17];
    if (
      ![144, 160, 176].includes(y) &&
      !isPlayerStart(x, y, PLAYERSTARTPOSITIONS) &&
      !collideWallGenerate(x, y, rooms[room].walls) &&
      !collideWallGenerate(x, y, walls) &&
      (allowedValues.includes(generatewall) ||
        (generatewall === 2 && !isCenterObject) ||
        (generatewall === 3 && !isObject(x, y, CARPET)) ||
        (generatewall === 4 && !isObject(x, y, TRAPDOOR)) ||
        (generatewall === 5 && !isArrowGround && !isCenterObject) ||
        (generatewall === 6 && !isObject(x, y, BALANCOIRE)) ||
        (generatewall === 9 &&
          y <= 144 &&
          !isPlayerStart(x, y, PLAYERSTARTPOSITIONSMINI)) ||
        ((generatewall === 12 || generatewall === 13) && y <= 224 && y >= 32) ||
        (generatewall === 14 && y <= 224 && !isObject(x, y, CARPET2)) ||
        (generatewall === 15 && !isObject(x, y, ARROWGROUND2)))
    ) {
      walls.push(wall);
    }
  }
  walls.sort((a, b) => a.y - b.y);
  return walls;
}

function generateWallsIndestructible(generationWall) {
  const walls = [
    { x: 8, y: 32 + 144, width: 16, height: 16, destructible: false },
    { x: 8, y: 32 + 176, width: 16, height: 16, destructible: false },
    { x: 8 + 224, y: 32 + 144, width: 16, height: 16, destructible: false },
    { x: 8 + 224, y: 32 + 176, width: 16, height: 16, destructible: false },
  ];

  const xValues = [16, 48, 80, 112, 144, 176, 208];
  const yValues = [16, 48, 80, 112, 208, 240, 272, 304];

  if (generationWall === 8 || generationWall === 10 || generationWall === 11) {
    xValues.splice(0, xValues.length);
  } else if (generationWall === 9) {
    yValues.splice(4, yValues.length);
  }

  // Générer les variations
  generateWalls(xValues, yValues, false);

  let xTunnel = [16, 48, 80, 112, 144, 176, 208];
  let yTunnel = [144, 160, 176];

  if (generationWall === 16) {
    xTunnel.push(32, 64, 96, 128, 160, 192);
    xTunnel.splice(3, 1);
  } else if (generationWall === 17) {
    xTunnel.push(32, 64, 96, 128, 160, 192);
    xTunnel.splice(5, 1);
    xTunnel.splice(3, 1);
    xTunnel.splice(1, 1);
  } else if (generationWall === 3) {
    xTunnel.push(64, 96, 128, 160);
  } else if (generationWall === 4 || generationWall === 9) {
    xTunnel.push(32, 64, 96, 104, 128, 160, 192);
  } else if (generationWall === 15) {
    xTunnel.push(32, 192);
  } else if (generationWall === 6) {
    generateWalls([16, 208], [32, 64, 96, 224, 256, 288], false);
  }

  generateWalls(xTunnel, yTunnel, false);

  function generateWalls(xValues, yValues, destructible) {
    for (let i = 0; i < xValues.length; i++) {
      for (let j = 0; j < yValues.length; j++) {
        walls.push(new Wall(xValues[i], yValues[j], destructible));
      }
    }
  }

  return walls;
}

/*--------------------------ITEM------------------------------- */
//proba :
/* 7 items
    fire = 20
    fire max = 10
    fire low = 10
    speed = 20
    slow =10
    bomb = 20
    bomb less = 10
    */
function generateItem(room, x, y) {
  //40% de chance d'avoir un item
  if (getRandomArbitrary(0, 100) >= 40) return;

  const typeProbas = {
    fire: 20,
    fireMax: 10,
    fireLow: 10,
    speed: 20,
    slow: 10,
    bomb: 20,
    bombLess: 10,
  };

  const probaType = getRandomArbitrary(0, 100);
  let type = "";
  let start = 0;
  for (const [key, value] of Object.entries(typeProbas)) {
    const end = start + value;
    if (probaType >= start && probaType < end) {
      type = key;
      break;
    }
    start = end;
  }
  const item = { x, y, type };
  room.items[room.roomData.nextItemId] = item;

  //envoyer les nouveaux items aux joueurs
  io.to(room.roomData.roomName).emit(
    "addItem",
    room.items[room.roomData.nextItemId],
    room.roomData.nextItemId
  );

  room.roomData.nextItemId++;
}

function onItem(room) {
  for (const playerId in room.players) {
    const player = room.players[playerId];
    for (const itemId in room.items) {
      const item = room.items[itemId];
      if (isColliding(player, item)) {
        if (item.type === "fire") {
          player.bombRange !== 10 && player.bombRange++;
        } else if (item.type === "fireMax") {
          player.bombRange = 10;
        } else if (item.type === "fireLow") {
          player.bombRange !== 1 && player.bombRange--;
        } else if (item.type === "speed") {
          player.speed !== 5 && player.speed++;
          //envoyer juste au player concerner la nouvelle vitesse
          io.to(playerId).emit("updateSpeed", player.speed, playerId);
        } else if (item.type === "slow") {
          player.speed !== 1 && player.speed--;
          io.to(playerId).emit("updateSpeed", player.speed, playerId);
        } else if (item.type === "bomb") {
          player.bombMax++;
        } else if (item.type === "bombLess") {
          player.bombMax !== 1 && player.bombMax--;
        }

        //on supprime l'item
        delete room.items[itemId];
        io.to(room.roomData.roomName).emit("itemPicked", itemId);
        //send new stats
      }
    }
  }
}

let moveBomb = 0;
/*-------------------------------BOUCLE INFINI-------------------------------*/
function gameLoop() {
  const currentTime = Date.now(); // get the current time
  const deltaTime = currentTime - moveBomb; // calculate the time since the last frame

  for (const roomId in rooms) {
    const room = rooms[roomId];
    updateBombs(room);
    updateExplosions(room);
    updateWallDestroy(room);
    onItem(room);

    if (deltaTime >= 10) {
      for (const id in room.bombs) {
        const bomb = room.bombs[id];
        if (bomb.move(room.walls, room.bombs, room.players)) {
          io.to(room.roomData.roomName).emit("updateBomb", bomb, id);
        }
      }
      moveBomb = currentTime;
    }
  }

  // Répéter la boucle de jeu
  setTimeout(gameLoop, 1000 / 60); // 60 FPS
}

gameLoop();

/*--------------------------EXPLOSION------------------------------- */

const isColliding = (player, type) => {
  return (
    player.x < type.x + 8 &&
    player.x + 8 > type.x &&
    player.y < type.y + 8 &&
    player.y + 8 > type.y
  );
};

function updateBombs(room) {
  for (const bombId in room.bombs) {
    const bomb = room.bombs[bombId];
    // walls
    if (
      Date.now() - bomb.timePlaced >= bomb.timeToExplode &&
      bomb.timeToExplode != -1
    ) {
      //on centre la bombe sur la case la plus proche
      bomb.x = Math.round((bomb.x - MAP.startLeft) / 16) * 16 + MAP.startLeft;
      bomb.y = Math.round((bomb.y - MAP.startTop) / 16) * 16 + MAP.startTop;

      //on creer une date pour l'ensemble des explosions
      let date = Date.now();
      // Créer une explosion au centre
      createExplosion(bomb.x, bomb.y, "center", room, date);
      if (bomb.bombType === 7) {
        explosionDangerouse(bomb, room, date);
      } else {
        explodeDirection(
          bomb.x,
          bomb.y,
          bomb,
          room,
          date,
          bomb.bombRange,
          "up"
        );
        explodeDirection(
          bomb.x,
          bomb.y,
          bomb,
          room,
          date,
          bomb.bombRange,
          "down"
        );
        explodeDirection(
          bomb.x,
          bomb.y,
          bomb,
          room,
          date,
          bomb.bombRange,
          "left"
        );
        explodeDirection(
          bomb.x,
          bomb.y,
          bomb,
          room,
          date,
          bomb.bombRange,
          "right"
        );
      }

      // Supprimer la bombe de la liste
      delete room.bombs[bombId];

      // Envoyer un événement aux clients de la room pour indiquer que la bombe a explosé
      io.to(room.roomData.roomName).emit("bombExploded", bombId);

      // Envoyer les explosions
      io.to(room.roomData.roomName).emit("addExplosion", room.explosions);
    }
  }
}

function updateExplosions(room) {
  for (const explosionId in room.explosions) {
    const explosion = room.explosions[explosionId];
    if (Date.now() - explosion.date >= 500) {
      delete room.explosions[explosionId];
      io.to(room.roomData.roomName).emit("explosionEnded", explosionId);
    }
    //si un joueur est sur une explosion
    for (const playerId in room.players) {
      const player = room.players[playerId];
      if (player.alive && isColliding(player, explosion)) {
        console.log(player.name + " est mort (Id : " + playerId + ")");
        player.alive = false;
        io.to(room.roomData.roomName).emit("playerDied", playerId);
      }
    }
  }
}

function updateWallDestroy(room) {
  for (let i = 0; i < room.wallsDestroy.length; i++) {
    const wall = room.wallsDestroy[i];
    if (Date.now() - wall.time >= 500) {
      room.wallsDestroy.splice(i, 1);
    }
  }
}

function explodeDirection(x, y, bomb, room, date, range, direction) {
  const dx = direction === "left" ? -16 : direction === "right" ? 16 : 0;
  const dy = direction === "up" ? -16 : direction === "down" ? 16 : 0;
  for (let i = 1; i <= range; i++) {
    const posX = x + i * dx;
    const posY = y + i * dy;
    if (
      posX < MAP.startLeft ||
      posX >= MAP.endRight ||
      posY < MAP.startTop ||
      posY >= MAP.endBottom
    )
      break;
    if (bomb.bombType !== 3) {
      if (isWallDestroyed(posX, posY, room)) break;
      if (collideWall(posX, posY, room)) {
        wallDestructible(posX, posY, room);
        break;
      }
    } else {
      wallDestructible(posX, posY, room);
      if (collideWallIndestructible(posX, posY, room)) break;
    }
    collideBomb(posX, posY, room);
    if (!isExplosion(posX, posY, room))
      createExplosion(posX, posY, direction, room, date);
  }
}

function explodeInDirectionDangerouse(x, y, room, date, direction) {
  for (let i = 1; i <= 2; i++) {
    const dx =
      direction === "left" ? -i * 16 : direction === "right" ? i * 16 : 0;
    const dy = direction === "up" ? -i * 16 : direction === "down" ? i * 16 : 0;
    const posX = x + dx;
    const posY = y + dy;
    if (
      posX < MAP.startLeft ||
      posX >= MAP.endRight ||
      posY < MAP.startTop ||
      posY >= MAP.endBottom
    )
      break;
    if (isWallDestroyed(posX, posY, room)) break;
    if (collideWall(posX, posY, room)) {
      wallDestructible(posX, posY, room);
      break;
    }
    collideBomb(posX, posY, room);
    createExplosion(posX, posY, direction, room, date);
    explodeDirection(
      posX,
      posY,
      { x, y },
      room,
      date,
      2,
      direction === "left" || direction === "right" ? "up" : "left"
    );
    explodeDirection(
      posX,
      posY,
      { x, y },
      room,
      date,
      2,
      direction === "left" || direction === "right" ? "down" : "right"
    );
  }
}

function explosionDangerouse(bomb, room, date) {
  explodeInDirectionDangerouse(bomb.x, bomb.y, room, date, "up");
  explodeInDirectionDangerouse(bomb.x, bomb.y, room, date, "down");
  explodeInDirectionDangerouse(bomb.x, bomb.y, room, date, "left");
  explodeInDirectionDangerouse(bomb.x, bomb.y, room, date, "right");
  //verifier qu'il y a une explosion a une position bomb.x, bomb.y
  //si oui, on ne fait pas exploser la bombe
  const positions = [
    [32, 32],
    [-32, -32],
    [32, -32],
    [-32, 32],
  ];

  // 1. Loop through all the positions that the bomb could explode in
  positions.forEach(([x, y]) => {
    // 2. Check if the bomb explodes at the current position
    const explosionDetected = isExplosion(bomb.x + x, bomb.y + y, room);
    // 3. If the bomb explodes at the current position, check if it explodes
    //    horizontally or vertically and call the corresponding function
    if (explosionDetected) {
      x === 32
        ? explodeDirection(bomb.x + x, bomb.y + y, bomb, room, date, 4, "left")
        : x === -32
          ? explodeDirection(bomb.x + x, bomb.y + y, bomb, room, date, 4, "right")
          : null;

      y === 32
        ? explodeDirection(bomb.x + x, bomb.y + y, bomb, room, date, 4, "up")
        : y === -32
          ? explodeDirection(bomb.x + x, bomb.y + y, bomb, room, date, 4, "down")
          : null;
    }
  });
  //Explosion aux extrémité de la bombe
  const directions = [
    { x: 16, y: 32, puissance: [3, 1, 4], sides: ["left", "right", "up"] },
    { x: 16, y: -32, puissance: [3, 1, 4], sides: ["left", "right", "down"] },
    { x: -16, y: 32, puissance: [3, 1, 4], sides: ["right", "left", "up"] },
    { x: -16, y: -32, puissance: [3, 1, 4], sides: ["right", "left", "down"] },
    { x: 32, y: 16, puissance: [3, 1, 4], sides: ["up", "down", "left"] },
    { x: 32, y: -16, puissance: [3, 1, 4], sides: ["down", "up", "left"] },
    { x: -32, y: 16, puissance: [3, 1, 4], sides: ["up", "down", "right"] },
    { x: -32, y: -16, puissance: [3, 1, 4], sides: ["down", "up", "right"] },
  ];

  directions.forEach((direction) => {
    if (isExplosion(bomb.x + direction.x, bomb.y + direction.y, room)) {
      direction.puissance.forEach((p, index) => {
        if (direction.sides && direction.sides.length > index) {
          explodeDirection(
            bomb.x + direction.x,
            bomb.y + direction.y,
            bomb,
            room,
            date,
            p,
            direction.sides[index]
          );
        }
      });
    }
  });
}

function isExplosion(x, y, room) {
  let explosions = room.explosions;
  for (let i in explosions) {
    if (explosions[i].x === x && explosions[i].y === y) {
      return true;
    }
  }
  return false;
}
//-------------------------------SERVEUR DATA--------------------------------
server.on("error", (err) => {
  console.error(err);
});

server.listen(3000, "0.0.0.0", function () {
  console.log("Listening to port:  " + 3000);
});
