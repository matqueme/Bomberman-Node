import http from "http";
import express from "express";
import path from "path";
import { Server } from "socket.io";
import { WALL } from "./const.js";
import { MAP } from "./const.js";

const app = express();

app.use(express.static("../client"));

const server = http.createServer(app);
const io = new Server(server);

const rooms = {};

const listener = (...args) => {
  console.log(args);
};

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
        walls: WALL.wall,
        roomData: {
          nameroom: param.room,
          maxPlayers: 8,
          gameStarted: false,
          nextBombId: 0,
          nextExplosionId: 0,
        },
      };
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
    const usedNumbers = new Set(
      Object.values(rooms[param.room].players).map(
        (player) => player.playerNumber
      )
    );
    let smallestPlayerNumber = 1;
    while (usedNumbers.has(smallestPlayerNumber)) {
      smallestPlayerNumber++;
    }

    // Si il n'y a aucun joueur dans la room on le met en admin
    rooms[param.room].players[socket.id] = {
      id: socket.id,
      name: param.name,
      x: 0,
      y: 0,
      alive: true,
      admin: Object.keys(rooms[param.room].players).length == 0,
      playerNumber: smallestPlayerNumber,
      nextBombId: 0,
    };

    // Envoyer les informations d'Admin
    if (rooms[param.room].players[socket.id].admin) {
      io.to(socket.id).emit("admin", true);
    }

    // Envoyer ses informations au joueur qui vient de rejoindre
    for (let id in rooms[param.room].players) {
      io.to(socket.id).emit("addCharacter", rooms[param.room].players[id]);
    }

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

  //Modify player parameter -------------------
  socket.on("editplayer", (param, nbtab) => {
    // let user = users.getUser(socket.id);
    // if (user) {
    //   //ca update player
    //   settings.updatePlayer(nbtab, user.room, param);
    //   io.to(socket.id).emit(
    //     "paramGame",
    //     settings.getAllOfAGame(user.room),
    //     nbtab
    //   );
    // }
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
    const bomb = new Bomb(data.x, data.y, rooms[data.room].roomData.nextBombId);
    // Ajoute la bombe à la liste des bombes de la salle correspondante
    rooms[data.room].bombs[rooms[data.room].roomData.nextBombId] = bomb;

    // Met à jour la variable nextBombId de la salle pour la prochaine bombe
    rooms[data.room].roomData.nextBombId++;

    // Envoie la bombe à tout les joueurs dans la room
    io.to(data.room).emit("addBomb", bomb);
  });

  //START -------------------
  socket.on("start", () => {
    // let user = users.getUser(socket.id);
    // if (user && settings.getState(user.room) == 0) {
    //   settings.changeState(user.room, 1);
    //   settings.start(user.room, users.getPlayerNumberList(user.room));
    //   io.to(user.room).emit("paramGame", settings.getAllOfAGame(user.room));
    //   io.to(user.room).emit("stateGame", 1);
    // }
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
        }

        // On supprime le joueur de la room
        delete room.players[socket.id];
        console.log(`Le joueur a été supprimé de la room "${roomName}"`);

        // Si il n'y a plus de joueurs dans la room, on supprime la room
        if (Object.keys(room.players).length === 0) {
          console.log(`La room "${roomName}" a été supprimée`);
          delete rooms[roomName];
        }
      }
    });
  });
});
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

function collideWall(x, y, room) {
  for (let id = 0; id < room.walls.length; id++) {
    const wall = room.walls[id];
    if (x == wall.x && y == wall.y) {
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

/*--------------------------Bombe------------------------------- */

class Bomb {
  constructor(x, y, id) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = 64;
    this.height = 64;
    //this.owner = owner;
    this.timePlaced = Date.now();
    this.timeToExplode = 3000; // 3 secondes
    this.explosionRadius = 4; // Par exemple
  }
}

//----------------------BOUCLE INFINI---------------------------
function gameLoop() {
  for (const roomId in rooms) {
    const room = rooms[roomId];
    updateBombs(room);
    updateExplosions(room);
  }

  // Répéter la boucle de jeu
  setTimeout(gameLoop, 1000 / 60); // 60 FPS
}

gameLoop();

function updateBombs(room) {
  for (const bombId in room.bombs) {
    const bomb = room.bombs[bombId];
    // walls
    if (Date.now() - bomb.timePlaced >= bomb.timeToExplode) {
      //on creer une date pour l'ensemble des explosions
      let date = Date.now();

      // Créer une explosion au centre
      createExplosion(bomb.x, bomb.y, "center", room, date);

      // Explosion vers le haut
      for (let i = 1; i <= bomb.explosionRadius; i++) {
        if (bomb.y - i * 64 < MAP.startTop) break;
        //si on collisionne un wall
        if (collideWall(bomb.x, bomb.y - i * 64, room)) break;
        collideBomb(bomb.x, bomb.y - i * 64, room);
        createExplosion(bomb.x, bomb.y - i * 64, "up", room, date);
      }

      // Explosion vers le bas
      for (let i = 1; i <= bomb.explosionRadius; i++) {
        if (bomb.y + i * 64 >= MAP.endBottom) break;
        if (collideWall(bomb.x, bomb.y + i * 64, room)) break;
        collideBomb(bomb.x, bomb.y + i * 64, room);
        createExplosion(bomb.x, bomb.y + i * 64, "down", room, date);
      }

      // Explosion vers la gauche
      for (let i = 1; i <= bomb.explosionRadius; i++) {
        if (bomb.x - i * 64 < MAP.startLeft) break;
        if (collideWall(bomb.x - i * 64, bomb.y, room)) break;
        collideBomb(bomb.x - i * 64, bomb.y, room);
        createExplosion(bomb.x - i * 64, bomb.y, "left", room, date);
      }

      // Explosion vers la droite
      for (let i = 1; i <= bomb.explosionRadius; i++) {
        if (bomb.x + i * 64 >= MAP.endRight) break;
        if (collideWall(bomb.x + i * 64, bomb.y, room)) break;
        collideBomb(bomb.x + i * 64, bomb.y, room);
        createExplosion(bomb.x + i * 64, bomb.y, "right", room, date);
      }

      // Supprimer la bombe de la liste
      delete room.bombs[bombId];

      // Envoyer un événement aux clients de la room pour indiquer que la bombe a explosé
      io.to(room.roomData.nameroom).emit("bombExploded", bombId);

      //envoyer les explosions
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
        player.x + 64 >= explosion.x &&
        player.x <= explosion.x + 64 &&
        player.y + 64 >= explosion.y &&
        player.y <= explosion.y + 64
      ) {
        console.log(player.name + " est mort (Id : " + playerId + ")");
        player.alive = false;
      }
    }
  }
}

//-------------------------------SERVEUR DATA--------------------------------
server.on("error", (err) => {
  console.error(err);
});

server.listen(3000, "0.0.0.0", function () {
  console.log("Listening to port:  " + 3000);
});
