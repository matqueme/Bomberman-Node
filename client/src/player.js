import { MAP } from "./const.js";
import { PLAYER } from "./const.js";

class Player {
  constructor(param) {
    /*ID*/
    this.id = param.id;

    this.admin = param.admin;

    /*Vivant ou mort*/
    this.alive = param.alive;

    /*POSITON AND NUMBER*/
    this.playerNumber = param.playerNumber;
    this.x = param.x; //position x en start
    this.y = param.y; //position y en start

    this.width = PLAYER.widthPlayer;
    this.height = PLAYER.heightPlayer;

    /*DISPLAY PARAMETER*/
    this.frameX = 0; // position de la frame X
    this.frameY = 0; // position de la frame y
    this.frameCount = 3; // nombre de frame pour l'animation
    /*LAST MOVE*/
    this.lastMove = 0;

    /*SPEED*/
    this.speed = param.speed; //vitesse de déplacement
  }

  /*RETURN*/
  get getSpeed() {
    //dictionnaire de la vitesse
    const speeds = {
      1: 16,
      2: 12,
      3: 8,
      4: 6,
      5: 4,
    };
    return speeds[this.speed];
  }

  /*------------------------ANNIMATION ------------------------------ */

  //pour animation si il bouge ou pas
  updateSprite() {
    console.log(this.lastMove + " " + Date.now());
    if (this.frameY > 3 && this.lastMove < Date.now() - 100) {
      this.frameY = this.frameY - 4;
      this.frameCount = 3;
    }

    if (this.frameX < this.frameCount - 1) this.frameX++;
    else this.frameX = 0;
  }
}

export default Player;
