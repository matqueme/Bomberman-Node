import { MAP } from "./const.js";
import { PLAYER } from "./const.js";

class Player {
  constructor(param) {
    /*ID*/
    this.id = param.id;

    /*POSITON AND NUMBER*/
    this.playerNumber = param.playerNumber;
    this.x = param.x; //position x en start
    this.y = param.y; //position y en start

    this.width = PLAYER.widthPlayer;
    this.height = PLAYER.heightPlayer;

    this.boxX = param.boxX;
    this.boxY = param.boxY;

    /*DISPLAY PARAMETER*/
    this.frameX = param.frameX; // position de la frame X
    this.frameY = param.frameY; // position de la frame y
    this.frameCount = param.frameCount; // nombre de frame pour l'animation
    this.moving = param.moving; //si il bouge

    /*HITBOX*/
    this.hitboxX = param.hitboxX; // position de la hitbox largeur
    this.hitboxY = param.hitboxY; // position de la hitbox hauteur
    this.hitboxWH = param.hitboxWH; //  hitbox en longeur/largeur

    /*SPEED*/
    this.speed = param.speed; //vitesse de déplacement

    /*LAST MOVE*/
    this.lastMove = 0;

    /*BOMB PARAMETER*/
    this.bombtype = param.bombtype;
    this.bombpower = param.bombpower;
    this.bombnumber = param.bombnumber;
  }

  /*RETURN*/

  get getNumberPlayer() {
    return this.playerNumber;
  }

  get getbombnumber() {
    return this.bombnumber;
  }

  get getbombpower() {
    return this.bombpower;
  }

  get getBoxX() {
    return this.boxX;
  }

  get getBoxY() {
    return this.boxY;
  }

  move2(dx, dy, walls) {
    // Calculez la boîte englobante du joueur pour la prochaine position
    let nextBoundingBox = {
      x: this.x + dx,
      y: this.y + dy,
      width: this.width,
      height: this.height,
    };

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

      if (
        nextBoundingBox.x < wall.x + wall.width &&
        nextBoundingBox.x + nextBoundingBox.width > wall.x &&
        nextBoundingBox.y < wall.y + wall.height &&
        nextBoundingBox.y + nextBoundingBox.height > wall.y
      ) {
        // Si le joueur a heurté un mur, s'il n'est pas au centre le deplacer (haut,bas ou gauche,droite)
        //droite

        if (this.x + this.width <= wall.x) {
          if (
            this.y + this.height < wall.y + wall.height &&
            //si le mur est au dessus du mur a droite
            !walls.find((wal) => wal.x === wall.x && wal.y === wall.y - 64)
          ) {
            this.y -= dx;
          } else if (
            this.y + this.height > wall.y + wall.height &&
            !walls.find((wal) => wal.x === wall.x && wal.y === wall.y + 64)
          )
            this.y += dx;
          else this.x = wall.x - this.width;
          //gauche
        } else if (this.x >= wall.x + wall.width) {
          if (
            this.y + this.height < wall.y + wall.height &&
            !walls.find((wal) => wal.x === wall.x && wal.y === wall.y - 64)
          )
            this.y += dx;
          else if (
            this.y + this.height > wall.y + wall.height &&
            !walls.find((wal) => wal.x === wall.x && wal.y === wall.y + 64)
          )
            this.y -= dx;
          else this.x = wall.x + wall.width;
          //bas
        } else if (this.y + this.height <= wall.y) {
          if (
            this.x + this.width < wall.x + wall.width &&
            !walls.find((wal) => wal.x === wall.x - 64 && wal.y === wall.y)
          )
            this.x -= dy;
          else if (
            this.x + this.width > wall.x + wall.width &&
            !walls.find((wal) => wal.x === wall.x + 64 && wal.y === wall.y)
          )
            this.x += dy;
          else this.y = wall.y - this.height;
          //haut
        } else if (this.y >= wall.y + wall.height) {
          if (
            this.x + this.width < wall.x + wall.width &&
            !walls.find((wal) => wal.x === wall.x - 64 && wal.y === wall.y)
          )
            this.x += dy;
          else if (
            this.x + this.width > wall.x + wall.width &&
            !walls.find((wal) => wal.x === wall.x + 64 && wal.y === wall.y)
          )
            this.x -= dy;
          else this.y = wall.y + wall.height;
        }

        return;
      }
    }

    // Pas de collision détectée, déplacez le joueur
    this.x += dx;
    this.y += dy;
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  } //deplacement du joueur

  /*------------------------ANNIMATION ------------------------------ */
  //pour placer la hitbox du joueur, tout les calculs se font en fonction de la hitbox
  hitboxPlayer() {
    this.hitboxX = this.x + 2 * 4; //calcul pour le positionement
    this.hitboxY = this.y + 18 * 4; //calcul pour le positionement
  }

  //affiche le personnage sur la map
  drawSprite(ctx, img) {
    ctx.drawImage(
      img,
      0,
      0,
      this.hitboxWH / 4,
      this.hitboxWH / 4,
      this.hitboxX,
      this.hitboxY,
      this.hitboxWH,
      this.hitboxWH
    );
    ctx.drawImage(
      img,
      this.frameX * PLAYER.width,
      this.frameY * PLAYER.height,
      PLAYER.width,
      PLAYER.height,
      this.x,
      this.y,
      PLAYER.width * 4,
      PLAYER.height * 4
    );
  }

  //pour animation si il bouge ou pas
  handlePlayerFrame() {
    this.calculBoxPlayer();
    //remmettre a 0
    if (this.moving && this.frameX < 3) {
      this.frameX = 3;
    } else if (!this.moving && this.frameX > 3) {
      this.frameX = 0;
    }
    //Faire bouger
    if (this.frameX < this.frameCount - 1) {
      this.frameX++;
    } else {
      if (this.moving) {
        this.frameX = 3;
      } else {
        this.frameX = 0;
      }
    }
  }

  calculBoxPlayer() {
    this.boxX = Math.round((this.x - 24) / (16 * 4));
    this.boxY = Math.round((this.y - 56) / (16 * 4));
    // console.log("x : ", this.boxX, "y : ", this.boxY);
  }

  /*--------------------------MOUVEMENT DU PERSONNAGE--------------------------- */

  //fonction pour deplacer le joueur
  moveLeft() {
    if (this.hitboxX > MAP.startLeft) {
      this.x -= this.speed;
    }
    this.moveLeftAnimation();
  }

  moveRight() {
    if (this.hitboxX + this.hitboxWH < MAP.endRight) {
      this.x += this.speed;
    }
    this.moveRightAnimation();
  }

  moveUp() {
    if (this.hitboxY > MAP.startUp) {
      this.y -= this.speed;
    }
    this.moveUpAnimation();
  }

  moveDown() {
    if (this.hitboxY + this.hitboxWH < MAP.endBottom) {
      this.y += this.speed;
    }
    this.moveDownAnimation();
  }

  /*----------------------------ANIMATION/AFFICHAGE------------------------------ */
  moveLeftAnimation() {
    this.frameY = 2;
    this.moving = true;
    this.frameCount = 9;
  }

  moveRightAnimation() {
    this.frameY = 3;
    this.moving = true;
    this.frameCount = 9;
  }

  moveUpAnimation() {
    this.frameY = 4;
    this.moving = true;
    this.frameCount = 9;
  }

  moveDownAnimation() {
    this.frameY = 1;
    this.moving = true;
    this.frameCount = 9;
  }

  collideWallDown(x, y, xTab, yTab, map) {
    if (yTab + 1 >= map.length) {
      this.moveDown(MAP.endBottom);
    } else {
      if (map[yTab + 1][xTab] == "0" && Number.isInteger(x)) {
        this.moveDown(MAP.endBottom);
      } else if (!Number.isInteger(x)) {
        if (x > Math.round(x)) {
          if (map[yTab + 1][xTab] == "0") {
            this.moveLeft(MAP.startLeft);
          } else {
            if (map[yTab + 1][xTab + 1] == "0") {
              this.moveRight(MAP.endRight);
            } else {
              this.moveDownAnimation();
            }
          }
        } else {
          if (map[yTab + 1][xTab] == "x" || map[yTab + 1][xTab] == "b") {
            if (map[yTab + 1][xTab + 1] == "0") {
              this.moveRight(MAP.endRight);
            } else {
              this.moveDownAnimation();
            }
          } else {
            this.moveLeft(MAP.startLeft);
          }
        }
      } else {
        //gestion des bombes en dessous du joueur
        //si on est sur une bombe
        if (map[Math.round(y)][Math.round(x)] == "b") {
          //si y a pas de bombe a droite ou se deplace
          if (map[Math.round(y) + 1][Math.round(x)] == "0") {
            this.moveDown(MAP.endBottom);
            //si y a une bombe mais qu'on es plus a gauche de la bombe on peut aller jusqu'au centre de la case
          } else if (
            map[Math.round(y) + 1][Math.round(x)] == "b" &&
            y < Math.round(y)
          ) {
            this.moveDown(MAP.endBottom);
            //sinon on met juste l'animation
          } else {
            this.moveDownAnimation();
          }
        } else {
          this.moveDownAnimation();
        }
      }
    }
  }
}

export default Player;
