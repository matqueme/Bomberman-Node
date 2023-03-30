import http from "http";
import express from "express";
import { Server } from "socket.io";

//calculer le temps d'import

import {
  MAP,
  MAPS,
  PLAYERSTARTPOSITIONS,
  CENTEROBJECTS,
  CARPET,
  TRAPDOOR,
  ARROWGROUND1,
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

    // Rejoindre la room
    socket.join(param.room);
    console.log(
      `Client connected: ${socket.id}, name : ${param.name}, to room : "${param.room}"`
    );

    // Créer une nouvelle room
    if (!rooms[param.room]) {
      rooms[param.room] = {
        players: {},
        bombs: {},
        explosions: {},
        walls: [],
        wallsDestroy: [],
        items: {},
        roomData: {
          nameroom: param.room,
          maxPlayers: 8,
          mapParameter: MAPS[0],
          gameStarted: false,
          nextBombId: 0,
          nextExplosionId: 0,
          nextItemId: 0,
        },
      };
      //generateWalls(param.room);
    }

    //Si il y a plus de 8 joueurs dans la room, on quitte
    if (Object.keys(rooms[param.room].players).length >= 8) {
      return;
    }

    // Si la partie a déjà commencé, on ne fait rien
    if (rooms[param.room].roomData.gameStarted) {
      console.log("Game already started");
      return;
    }

    //creation du numero de joueur le plus petit disponible
    let smallestPlayerNumber = 1;
    const usedNumbers = new Set(
      Object.values(rooms[param.room].players).map(
        (player) => player.playerNumber
      )
    );
    while (usedNumbers.has(smallestPlayerNumber)) {
      smallestPlayerNumber++;
    }

    // Si il n'y a aucun joueur dans la room on le met en admin
    rooms[param.room].players[socket.id] = {
      id: socket.id,
      name: param.name,
      x: PLAYERSTARTPOSITIONS["player" + smallestPlayerNumber][0].x,
      y: PLAYERSTARTPOSITIONS["player" + smallestPlayerNumber][0].y,
      alive: true,
      admin: Object.keys(rooms[param.room].players).length == 0,
      playerNumber: smallestPlayerNumber,
      bombType: 7,
      bombMax: 4,
      bombRange: 1,
    };

    if (Object.keys(rooms[param.room].players).length >= 2) {
      adminStartBtn(true, param.room);
    }

    // Envoyer ses informations au joueur qui vient de rejoindre
    for (let id in rooms[param.room].players) {
      io.to(socket.id).emit("addCharacter", rooms[param.room].players[id]);
    }

    io.to(socket.id).emit(
      "isAdmin",
      rooms[param.room].players[socket.id].admin
    );

    io.to(socket.id).emit(
      "addParam",
      rooms[param.room].roomData,
      MAPS.indexOf(rooms[param.room].roomData.mapParameter)
    );

    io.to(socket.id).emit("addWalls", rooms[param.room].walls);

    // Envoyer les informations du nouveau joueur aux autres joueurs
    socket.broadcast.emit("addCharacter", rooms[param.room].players[socket.id]);
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
  socket.on("changePlayerNumber", (param) => {
    // let user = users.getUser(socket.id);
    // if (settings.getState(user.room) == 0 && user) {
    //   users.setChangePlayerNumber(socket.id, param);
    //   io.to(user.room).emit(
    //     "updateUserList",
    //     users.getUserList(user.room),
    //     users.getPlayerNumberList(user.room)
    //   );
    //   io.to(socket.id).emit(
    //     "playernumberTab",
    //     users.getNumberPlayer(socket.id)
    //   );
    //}
  });

  socket.on("updateCharacterPosition", (data) => {
    // Mettre à jour la position du joueur
    rooms[data.room].players[socket.id].x = data.x;
    rooms[data.room].players[socket.id].y = data.y;

    // Envoyer les informations de mise à jour a tout les joueurs
    io.emit("updateCharacterPosition", {
      id: socket.id,
      x: data.x,
      y: data.y,
    });
  });

  //Add bomb
  socket.on("addBomb", (data) => {
    if (
      data.x < MAP.startLeft ||
      data.x > MAP.endRight ||
      data.y > MAP.endTop ||
      data.y < MAP.startTop
    )
      return;
    //verifier que l'utilisateur n'a pas déposer son max de bombe
    if (
      Object.keys(rooms[data.room].bombs).filter(
        (bomb) => rooms[data.room].bombs[bomb].owner == socket.id
      ).length >= rooms[data.room].players[socket.id].bombMax
    )
      return;

    let timeToExplode = 3000;
    let bombRange = rooms[data.room].players[socket.id].bombRange;
    let bombType = rooms[data.room].players[socket.id].bombType;

    if (rooms[data.room].players[socket.id].bombType == 2) {
      timeToExplode = -1;
    } else if (rooms[data.room].players[socket.id].bombType == 4) {
      !Object.values(rooms[data.room].bombs).find(
        (bomb) => bomb.owner == socket.id && bomb.bombType == 4
      )
        ? (bombRange = 8)
        : (bombType = 1);
    } else if (rooms[data.room].players[socket.id].bombType == 5) {
      !Object.values(rooms[data.room].bombs).find(
        (bomb) => bomb.owner == socket.id && bomb.bombType == 5
      )
        ? (timeToExplode = -1)
        : (bombType = 1);
    } else if (rooms[data.room].players[socket.id].bombType == 7) {
      !Object.values(rooms[data.room].bombs).find(
        (bomb) => bomb.owner == socket.id && bomb.bombType == 7
      )
        ? (bombRange = 2)
        : (bombType = 1);
    }

    const bomb = new Bomb(
      data.x,
      data.y,
      rooms[data.room].roomData.nextBombId,
      bombType,
      bombRange,
      timeToExplode,
      socket.id
    );
    // Ajoute la bombe à la liste des bombes de la salle correspondante
    rooms[data.room].bombs[rooms[data.room].roomData.nextBombId] = bomb;

    // Met à jour la variable nextBombId de la salle pour la prochaine bombe
    rooms[data.room].roomData.nextBombId++;

    // Envoie la bombe à tout les joueurs dans la room
    io.to(data.room).emit("addBomb", bomb);
  });

  //--------------------Paramètres--------------------

  socket.on("changeMap", (param, roomName) => {
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
      //a mettre au start !!!!!!!!!
      rooms[roomName].walls = generateWallsIndestructible(
        rooms[roomName].roomData.mapParameter.generatioWall
      );
      // rooms[roomName].walls = generateWallsDestructible(
      //   rooms[roomName].roomData.mapParameter.generatioWall
      // );
      rooms[roomName].walls.push(
        generateWallsDestructible(
          rooms[roomName].roomData.mapParameter.generatioWall,
          roomName
        )
      );
      rooms[roomName].walls = rooms[roomName].walls.flat();

      io.to(roomName).emit("addWalls", rooms[roomName].walls);

      //send to everyone
      io.to(roomName).emit(
        "changeMap",
        rooms[roomName].roomData.mapParameter,
        newIndex
      );
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

        // Envoyer les informations de déconnexion au autres joueurs
        socket.broadcast.emit("removeCharacter", socket.id);

        // On supprime le joueur de la room
        console.log(
          `Le joueur "${
            room.players[socket.id].name
          }" a été supprimé de la room "${roomName}"`
        );
        delete room.players[socket.id];

        // Si il n'y a plus de joueurs dans la room, on supprime la room
        if (Object.keys(room.players).length === 0) {
          console.log(`La room "${roomName}" a été supprimée`);
          delete rooms[roomName];
        } else {
          // Si il y a plus de 2 joueurs dans la room, on active le bouton de lancement de partie
          if (Object.keys(room.players).length >= 2) {
            adminStartBtn(true, roomName);
          } else {
            adminStartBtn(false, roomName);
          }
        }
      }
    });
  });
});

/*--------------------------BOMB------------------------------- */

class Bomb {
  constructor(x, y, id, bombType, bombRange, timeToExplode, user) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = 16;
    this.height = 16;
    this.owner = user;
    //this.owner = owner;
    this.timePlaced = Date.now();
    this.timeToExplode = timeToExplode;
    this.bombType = bombType;
    this.bombRange = bombRange;
  }
}

const adminStartBtn = (isBtn, room) => {
  //recuperer l'index du joueur qui est admin
  let index = Object.keys(rooms[room].players).find(
    (key) => rooms[room].players[key].admin
  );
  // Envoyer les informations d'Admin
  if (rooms[room].players[index].admin) {
    io.to(index).emit("adminBtn", isBtn);
  }
};
/*--------------------------Explosion------------------------------- */

function createExplosion(x, y, type, room, date) {
  const newExplosion = {
    x,
    y,
    type,
    id: room.roomData.nextExplosionId,
    date: date,
  };
  // ajout de l'objet explosion à la variable explosions
  room.explosions[room.roomData.nextExplosionId] = newExplosion;
  // Met à jour la variable nextExplosionId de la salle pour la prochaine explosion
  room.roomData.nextExplosionId++;
}

function collideWall2(x, y, wall) {
  for (let id = 0; id < wall.length; id++) {
    if (x == wall[id].x && y == wall[id].y) {
      return true;
    }
  }
  return false;
}

function collideWall(x, y, room) {
  for (let id = 0; id < room.walls.length; id++) {
    const wall = room.walls[id];
    if (x == wall.x && y == wall.y) {
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

function collideBomb(x, y, room) {
  for (const bombId in room.bombs) {
    const bomb = room.bombs[bombId];
    if (x == bomb.x && y == bomb.y) {
      bomb.timeToExplode = 0;
    }
  }
}

/*--------------------------WALL------------------------------- */

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
      io.to(room.roomData.nameroom).emit("addWalls", room.walls);
    }
  }
}

function isPlayerStart(x, y) {
  for (let player in PLAYERSTARTPOSITIONS) {
    for (let position of PLAYERSTARTPOSITIONS[player]) {
      if (x == position.x && y == position.y) {
        return true;
      }
    }
  }
  return false;
}

function isCenterObjects(x, y) {
  for (let centerObject of CENTEROBJECTS) {
    if (x == centerObject.x && y == centerObject.y) {
      return true;
    }
  }
  return false;
}

function isCarpet(x, y) {
  for (let carpet of CARPET) {
    if (x == carpet.x && y == carpet.y) {
      return true;
    }
  }
  return false;
}

function isTrapdoor(x, y) {
  for (let trapdoor of TRAPDOOR) {
    if (x == trapdoor.x && y == trapdoor.y) {
      return true;
    }
  }
  return false;
}

function isArrowInTheGround(x, y) {
  for (let arrow of ARROWGROUND1) {
    if (x == arrow.x && y == arrow.y) {
      return true;
    }
  }
  return false;
}

// Generate walls
function generateWallsDestructible(generatewall, room) {
  console.log(generatewall);
  let walls = [];
  let wallTotal = 214;
  if (generatewall === 2) {
    wallTotal = wallTotal - CENTEROBJECTS.length;
  } else if (generatewall === 3) {
    wallTotal = wallTotal - CARPET.length;
  } else if (generatewall === 4) {
    wallTotal = wallTotal - TRAPDOOR.length;
  } else if (generatewall === 5) {
    wallTotal = wallTotal - ARROWGROUND1.length - CENTEROBJECTS.length;
  }
  const randomRatioWall = getRandomArbitrary(0.55, 0.75);
  const wallDestructible = Math.floor(wallTotal * randomRatioWall);
  while (walls.length < wallDestructible) {
    const x = random(0, 14) * 16 + MAP.startLeft;
    const y = random(0, 20) * 16 + MAP.startTop;
    const wall = {
      x,
      y,
      width: 16,
      height: 16,
      destructible: true,
    };
    if (
      !collideWall(x, y, rooms[room]) &&
      y != 144 + MAP.startTop &&
      y != 160 + MAP.startTop &&
      y != 176 + MAP.startTop &&
      !isPlayerStart(x, y) &&
      !collideWall2(x, y, walls)
    ) {
      if (generatewall === 2 && !isCenterObjects(x, y)) {
        walls.push(wall);
      } else if (generatewall === 3 && !isCarpet(x, y)) {
        walls.push(wall);
      } else if (generatewall === 4 && !isTrapdoor(x, y)) {
        walls.push(wall);
      } else if (
        generatewall === 5 &&
        !isArrowInTheGround(x, y) &&
        !isCenterObjects(x, y)
      ) {
        walls.push(wall);
      } else if (
        generatewall === 1 ||
        generatewall === 16 ||
        generatewall === 17
      ) {
        walls.push(wall);
      } else {
        // walls.push(wall);
        //console.log(x, y);
      }
      //rooms[room].walls.push(wall);
    }
  }
  walls.sort((a, b) => a.y - b.y);
  return walls;
  // rooms[room].walls.sort((a, b) => a.y - b.y);
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

  if (generationWall === 8 || generationWall === 10) {
    xValues.splice(0, yValues.length);
  } else if (generationWall === 9) {
    yValues.splice(4, yValues.length);
  }

  // Générer les variations
  for (let i = 0; i < xValues.length; i++) {
    for (let j = 0; j < yValues.length; j++) {
      addWall(xValues[i], yValues[j], false);
    }
  }

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
  }

  for (let i = 0; i < xTunnel.length; i++) {
    for (let j = 0; j < yTunnel.length; j++) {
      addWall(xTunnel[i], yTunnel[j], false);
    }
  }

  function addWall(x, y, type) {
    walls.push({
      x: 8 + x,
      y: 32 + y,
      width: 16,
      height: 16,
      destructible: type,
    });
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
  const probaItem = getRandomArbitrary(0, 100);
  //35% de chance d'avoir un item
  if (probaItem < 35) {
    const probaType = getRandomArbitrary(0, 100);
    let type = "";
    if (probaType < 20) {
      type = "fire";
    } else if (probaType < 30) {
      type = "fireMax";
    } else if (probaType < 40) {
      type = "fireLow";
    } else if (probaType < 60) {
      type = "speed";
    } else if (probaType < 70) {
      type = "slow";
    } else if (probaType < 90) {
      type = "bomb";
    } else if (probaType < 100) {
      type = "bombLess";
    }
    const item = {
      x: x,
      y: y,
      type: type,
    };
    room.items[room.roomData.nextItemId] = item;

    //envoyer les nouveaux items aux joueurs
    io.to(room.roomData.nameroom).emit(
      "addItem",
      room.items[room.roomData.nextItemId],
      room.roomData.nextItemId
    );

    room.roomData.nextItemId++;
  }
}

/*-------------------------------BOUCLE INFINI-------------------------------*/
function gameLoop() {
  for (const roomId in rooms) {
    const room = rooms[roomId];
    updateBombs(room);
    updateExplosions(room);
    updateWallDestroy(room);
  }

  // Répéter la boucle de jeu
  setTimeout(gameLoop, 1000 / 60); // 60 FPS
}

gameLoop();

function updateBombs(room) {
  for (const bombId in room.bombs) {
    const bomb = room.bombs[bombId];
    // walls
    if (
      Date.now() - bomb.timePlaced >= bomb.timeToExplode &&
      bomb.timeToExplode != -1
    ) {
      //on creer une date pour l'ensemble des explosions
      let date = Date.now();
      // Créer une explosion au centre
      createExplosion(bomb.x, bomb.y, "center", room, date);
      if (bomb.bombType === 7) {
        explosionDangerouse(bomb, room, date);
      } else {
        // Explosion vers le haut
        explodeUp(bomb.x, bomb.y, bomb, room, date, bomb.bombRange);

        // Explosion vers le bas
        explodeDown(bomb.x, bomb.y, bomb, room, date, bomb.bombRange);

        // Explosion vers la gauche
        explodeLeft(bomb.x, bomb.y, bomb, room, date, bomb.bombRange);

        // Explosion vers la droite
        explodeRight(bomb.x, bomb.y, bomb, room, date, bomb.bombRange);
      }

      // Supprimer la bombe de la liste
      delete room.bombs[bombId];

      // Envoyer un événement aux clients de la room pour indiquer que la bombe a explosé
      io.to(room.roomData.nameroom).emit("bombExploded", bombId);

      // Envoyer les explosions
      io.to(room.roomData.nameroom).emit("addExplosion", room.explosions);
    }
  }
}

function updateExplosions(room) {
  for (const explosionId in room.explosions) {
    const explosion = room.explosions[explosionId];
    if (Date.now() - explosion.date >= 500) {
      delete room.explosions[explosionId];
      io.to(room.roomData.nameroom).emit("explosionEnded", explosionId);
    }
    //si un joueur est sur une explosion
    for (const playerId in room.players) {
      const player = room.players[playerId];
      if (
        player.alive &&
        player.x + 16 > explosion.x &&
        player.x < explosion.x + 16 &&
        player.y + 16 > explosion.y &&
        player.y < explosion.y + 16
      ) {
        console.log(player.name + " est mort (Id : " + playerId + ")");
        player.alive = false;
        io.to(room.roomData.nameroom).emit("playerDied", playerId);
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

function explodeUp(x, y, bomb, room, date, bombRange) {
  for (let i = 1; i <= bombRange; i++) {
    if (y - i * 16 < MAP.startTop) break;
    if (bomb.bombType !== 3) {
      if (isWallDestroyed(x, y - i * 16, room)) break;
      if (collideWall(x, y - i * 16, room)) {
        wallDestructible(x, y - i * 16, room);
        break;
      }
    } else {
      wallDestructible(x, y - i * 16, room);
      if (collideWallIndestructible(x, y - i * 16, room)) break;
    }
    collideBomb(x, y - i * 16, room);
    if (!isExplosion(x, y - i * 16, room))
      createExplosion(x, y - i * 16, "up", room, date);
  }
}

function explodeDown(x, y, bomb, room, date, bombRange) {
  for (let i = 1; i <= bombRange; i++) {
    if (y + i * 16 >= MAP.endBottom) break;
    if (bomb.bombType !== 3) {
      if (isWallDestroyed(x, y + i * 16, room)) break;
      if (collideWall(x, y + i * 16, room)) {
        wallDestructible(x, y + i * 16, room);
        break;
      }
    } else {
      wallDestructible(x, y + i * 16, room);
      if (collideWallIndestructible(x, y + i * 16, room)) break;
    }
    collideBomb(x, y + i * 16, room);
    if (!isExplosion(x, y + i * 16, room))
      createExplosion(x, y + i * 16, "down", room, date);
  }
}

function explodeLeft(x, y, bomb, room, date, bombRange) {
  for (let i = 1; i <= bombRange; i++) {
    if (x - i * 16 < MAP.startLeft) break;
    if (bomb.bombType !== 3) {
      if (isWallDestroyed(x - i * 16, y, room)) break;
      if (collideWall(x - i * 16, y, room)) {
        wallDestructible(x - i * 16, y, room);
        break;
      }
    } else {
      wallDestructible(x - i * 16, y, room);
      if (collideWallIndestructible(x - i * 16, y, room)) break;
    }
    collideBomb(x - i * 16, y, room);
    if (!isExplosion(x - i * 16, y, room))
      createExplosion(x - i * 16, y, "left", room, date);
  }
}

function explodeRight(x, y, bomb, room, date, bombRange) {
  for (let i = 1; i <= bombRange; i++) {
    if (x + i * 16 >= MAP.endRight) break;
    if (bomb.bombType !== 3) {
      if (isWallDestroyed(x + i * 16, y, room)) break;
      if (collideWall(x + i * 16, y, room)) {
        wallDestructible(x + i * 16, y, room);
        break;
      }
    } else {
      wallDestructible(x + i * 16, y, room);
      if (collideWallIndestructible(x + i * 16, y, room)) break;
    }
    collideBomb(x + i * 16, y, room);
    if (!isExplosion(x + i * 16, y, room))
      createExplosion(x + i * 16, y, "right", room, date);
  }
}

function explosionDangerouse(bomb, room, date) {
  // Explosion vers le haut
  for (let i = 1; i <= 2; i++) {
    if (bomb.y - i * 16 < MAP.startTop) break;
    //pour ne pas faire exploser apres les walls deja detruit
    if (isWallDestroyed(bomb.x, bomb.y - i * 16, room)) break;
    //si on collisionne un wall
    if (collideWall(bomb.x, bomb.y - i * 16, room)) {
      wallDestructible(bomb.x, bomb.y - i * 16, room);
      break;
    }
    collideBomb(bomb.x, bomb.y - i * 16, room);
    createExplosion(bomb.x, bomb.y - i * 16, "up", room, date);
    explodeLeft(bomb.x, bomb.y - i * 16, bomb, room, date, 2);
    explodeRight(bomb.x, bomb.y - i * 16, bomb, room, date, 2);
  }
  //s'il y a une explosion a une position

  // Explosion vers le bas
  for (let i = 1; i <= 2; i++) {
    if (bomb.y + i * 16 >= MAP.endBottom) break;
    if (isWallDestroyed(bomb.x, bomb.y + i * 16, room)) break;
    if (collideWall(bomb.x, bomb.y + i * 16, room)) {
      wallDestructible(bomb.x, bomb.y + i * 16, room);
      break;
    }
    collideBomb(bomb.x, bomb.y + i * 16, room);
    createExplosion(bomb.x, bomb.y + i * 16, "down", room, date);
    explodeLeft(bomb.x, bomb.y + i * 16, bomb, room, date, 2);
    explodeRight(bomb.x, bomb.y + i * 16, bomb, room, date, 2);
  }
  // Explosion vers la gauche
  for (let i = 1; i <= 2; i++) {
    if (bomb.x - i * 16 < MAP.startLeft) break;
    if (isWallDestroyed(bomb.x - i * 16, bomb.y, room)) break;
    if (collideWall(bomb.x - i * 16, bomb.y, room)) {
      wallDestructible(bomb.x - i * 16, bomb.y, room);
      break;
    }
    collideBomb(bomb.x - i * 16, bomb.y, room);
    createExplosion(bomb.x - i * 16, bomb.y, "left", room, date);
    explodeUp(bomb.x - i * 16, bomb.y, bomb, room, date, 2);
    explodeDown(bomb.x - i * 16, bomb.y, bomb, room, date, 2);
  }

  // Explosion vers la droite
  for (let i = 1; i <= 2; i++) {
    if (bomb.x + i * 16 >= MAP.endRight) break;
    if (isWallDestroyed(bomb.x + i * 16, bomb.y, room)) break;
    if (collideWall(bomb.x + i * 16, bomb.y, room)) {
      wallDestructible(bomb.x + i * 16, bomb.y, room);
      break;
    }
    collideBomb(bomb.x + i * 16, bomb.y, room);
    createExplosion(bomb.x + i * 16, bomb.y, "right", room, date);
    explodeUp(bomb.x + i * 16, bomb.y, bomb, room, date, 2);
    explodeDown(bomb.x + i * 16, bomb.y, bomb, room, date, 2);
  }

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
      if (x === 32) {
        explodeLeft(bomb.x + x, bomb.y + y, bomb, room, date, 4);
      } else if (x === -32) {
        explodeRight(bomb.x + x, bomb.y + y, bomb, room, date, 4);
      }
      if (y === 32) {
        explodeUp(bomb.x + x, bomb.y + y, bomb, room, date, 4);
      } else if (y === -32) {
        explodeDown(bomb.x + x, bomb.y + y, bomb, room, date, 4);
      }
    }
  });
  //part 2
  if (isExplosion(bomb.x + 16, bomb.y + 32, room)) {
    explodeLeft(bomb.x + 16, bomb.y + 32, bomb, room, date, 3);
    explodeRight(bomb.x + 16, bomb.y + 32, bomb, room, date, 1);
    explodeUp(bomb.x + 16, bomb.y + 32, bomb, room, date, 4);
  }
  if (isExplosion(bomb.x + 16, bomb.y - 32, room)) {
    explodeRight(bomb.x + 16, bomb.y - 32, bomb, room, date, 1);
    explodeLeft(bomb.x + 16, bomb.y - 32, bomb, room, date, 3);
    explodeDown(bomb.x + 16, bomb.y - 32, bomb, room, date, 4);
  }
  if (isExplosion(bomb.x - 16, bomb.y + 32, room)) {
    explodeUp(bomb.x - 16, bomb.y + 32, bomb, room, date, 4);
    explodeLeft(bomb.x - 16, bomb.y + 32, bomb, room, date, 1);
    explodeRight(bomb.x - 16, bomb.y + 32, bomb, room, date, 3);
  }
  if (isExplosion(bomb.x - 16, bomb.y - 32, room)) {
    explodeDown(bomb.x - 16, bomb.y - 32, bomb, room, date, 4);
    explodeLeft(bomb.x - 16, bomb.y - 32, bomb, room, date, 1);
    explodeRight(bomb.x - 16, bomb.y - 32, bomb, room, date, 3);
  }
  if (isExplosion(bomb.x + 32, bomb.y + 16, room)) {
    explodeUp(bomb.x + 32, bomb.y + 16, bomb, room, date, 3);
    explodeDown(bomb.x + 32, bomb.y + 16, bomb, room, date, 1);
    explodeLeft(bomb.x + 32, bomb.y + 16, bomb, room, date, 4);
  }
  if (isExplosion(bomb.x + 32, bomb.y - 16, room)) {
    explodeUp(bomb.x + 32, bomb.y - 16, bomb, room, date, 1);
    explodeDown(bomb.x + 32, bomb.y - 16, bomb, room, date, 3);
    explodeLeft(bomb.x + 32, bomb.y - 16, bomb, room, date, 4);
  }
  if (isExplosion(bomb.x - 32, bomb.y + 16, room)) {
    explodeUp(bomb.x - 32, bomb.y + 16, bomb, room, date, 3);
    explodeDown(bomb.x - 32, bomb.y + 16, bomb, room, date, 1);
    explodeRight(bomb.x - 32, bomb.y + 16, bomb, room, date, 4);
  }
  if (isExplosion(bomb.x - 32, bomb.y - 16, room)) {
    explodeUp(bomb.x - 32, bomb.y - 16, bomb, room, date, 1);
    explodeDown(bomb.x - 32, bomb.y - 16, bomb, room, date, 3);
    explodeRight(bomb.x - 32, bomb.y - 16, bomb, room, date, 4);
  }
  console.log(room.explosions);
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
