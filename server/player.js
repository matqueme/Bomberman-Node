import { MAP } from "./const.js";
import { PLAYER } from "./const.js";

class Player {
  constructor(id, name, x, y, admin, playerNumber) {
    /*ID*/
    this.id = id;

    this.admin = admin;
    this.name = name;

    /*Vivant ou mort*/
    this.alive = true;

    /*POSITON AND NUMBER*/
    this.playerNumber = playerNumber;
    this.x = x; //position x en start
    this.y = y; //position y en start

    this.width = PLAYER.widthPlayer;
    this.height = PLAYER.heightPlayer;

    /*SPEED*/
    this.speed = 1; //vitesse de déplacement
    this.bombType = 1;
    this.bombMax = 1;
    this.bombRange = 1;
  }

  move(dx, dy, walls, bombs) {
    // Calculez la boîte englobante du joueur pour la prochaine position
    let nextBoundingBox = {
      x: this.x + dx,
      y: this.y + dy,
      width: this.width,
      height: this.height,
    };
    //dernier mouvement
    this.lastMove = Date.now();
    if (this.x > nextBoundingBox.x && this.frameY !== 5) {
      this.frameY = 5;
      this.frameCount = 6;
      this.frameX = 0;
    } else if (this.x < nextBoundingBox.x && this.frameY !== 6) {
      this.frameY = 6;
      this.frameCount = 6;
      this.frameX = 0;
    } else if (this.y > nextBoundingBox.y && this.frameY !== 7) {
      this.frameY = 7;
      this.frameCount = 6;
      this.frameX = 0;
    } else if (this.y < nextBoundingBox.y && this.frameY !== 4) {
      this.frameY = 4;
      this.frameCount = 6;
      this.frameX = 0;
    }

    // Vérifiez la collision avec les murs pour les déplacements verticaux
    for (let wall of walls) {
      //verifier la taille du terrain
      if (nextBoundingBox.x < MAP.startLeft) {
        this.x = MAP.startLeft;
        return;
      } else if (nextBoundingBox.x + nextBoundingBox.width > MAP.endRight) {
        this.x = MAP.endRight - nextBoundingBox.width;
        return;
      } else if (nextBoundingBox.y < MAP.startTop) {
        this.y = MAP.startTop;
        return;
      } else if (nextBoundingBox.y + nextBoundingBox.height > MAP.endBottom) {
        this.y = MAP.endBottom - nextBoundingBox.height;
        return;
      }

      //Collision avec les murs
      if (this.isCollisions(nextBoundingBox, wall)) {
        // Droite
        if (this.x + this.width <= wall.x) {
          // Si le mur est plus en dessous on monte et qu'il ny a pas de mur au dessus a droite
          if (
            this.y + this.height < wall.y + wall.height &&
            !walls.find((wal) => wal.x === wall.x && wal.y === wall.y - 16)
          )
            this.y -= dx;
          // Si le mur est plus au dessus on descend et qu'il ny a pas de mur en dessous a droite
          else if (
            this.y + this.height > wall.y + wall.height &&
            !walls.find((wal) => wal.x === wall.x && wal.y === wall.y + 16)
          )
            this.y += dx;
          // Si le joueur se déplace vers la droite et qu'il y a un mur a droite on le bloques
          else this.x = wall.x - this.width;

          // Gauche
        } else if (this.x >= wall.x + wall.width) {
          if (
            this.y + this.height < wall.y + wall.height &&
            !walls.find((wal) => wal.x === wall.x && wal.y === wall.y - 16)
          )
            this.y += dx;
          else if (
            this.y + this.height > wall.y + wall.height &&
            !walls.find((wal) => wal.x === wall.x && wal.y === wall.y + 16)
          )
            this.y -= dx;
          else this.x = wall.x + wall.width;
          // Bas
        } else if (this.y + this.height <= wall.y) {
          if (
            this.x + this.width < wall.x + wall.width &&
            !walls.find((wal) => wal.x === wall.x - 16 && wal.y === wall.y)
          )
            this.x -= dy;
          else if (
            this.x + this.width > wall.x + wall.width &&
            !walls.find((wal) => wal.x === wall.x + 16 && wal.y === wall.y)
          )
            this.x += dy;
          else this.y = wall.y - this.height;
          //haut
        } else if (this.y >= wall.y + wall.height) {
          if (
            this.x + this.width < wall.x + wall.width &&
            !walls.find((wal) => wal.x === wall.x - 16 && wal.y === wall.y)
          )
            this.x += dy;
          else if (
            this.x + this.width > wall.x + wall.width &&
            !walls.find((wal) => wal.x === wall.x + 16 && wal.y === wall.y)
          )
            this.x -= dy;
          else this.y = wall.y + wall.height;
        }

        return;
      }
    }
    let keys = Object.keys(bombs);

    // Vérifiez la collision avec les bombs , s'il y a collision on bloque le joueur, sinon si on est sur la moitie on ne fait rien
    for (let key of keys) {
      let bomb = bombs[key];
      if (this.isCollisions(nextBoundingBox, bomb))
        if (!this.onHalfBomb(bomb) && !this.farAwayBomb(bomb, dx, dy)) {
          return key;
        }
    }
    // Pas de collision détectée, déplacez le joueur
    this.x += dx;
    this.y += dy;
    return true;
  }

  //si on s'éloigne de la bombe on peut se déplacer
  farAwayBomb(bomb, dx, dy) {
    return (
      (this.x < bomb.x && this.x + this.width >= bomb.x && dx < 0) ||
      (this.x > bomb.x && this.x <= bomb.x + 16 && dx > 0) ||
      (this.y < bomb.y && this.y + this.height >= bomb.y && dy < 0) ||
      (this.y > bomb.y && this.y <= bomb.y + 16 && dy > 0)
    );
  }

  //si on est sur la moitie de la bombe on peut se déplacer
  onHalfBomb(bomb) {
    return (
      this.x + this.width / 2 >= bomb.x &&
      this.x + this.width / 2 <= bomb.x + 16 &&
      this.y + this.height / 2 >= bomb.y &&
      this.y + this.height / 2 <= bomb.y + 16
    );
  }

  //vérifie si il y a collision
  isCollisions(nextBoundingBox, object) {
    return (
      nextBoundingBox.x < object.x + 16 &&
      nextBoundingBox.x + nextBoundingBox.width > object.x &&
      nextBoundingBox.y < object.y + 16 &&
      nextBoundingBox.y + nextBoundingBox.height > object.y
    );
  }
}

export default Player;
