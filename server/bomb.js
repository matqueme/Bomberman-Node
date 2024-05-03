import { MAP } from "./const.js";
class Bomb {
  constructor(x, y, id, bombType, bombRange, timeToExplode, user) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = 16;
    this.height = 16;
    this.owner = user;
    this.propertie = "normal";

    //this.owner = owner;
    this.timePlaced = Date.now();
    this.timeToExplode = timeToExplode;
    this.bombType = bombType;
    this.bombRange = bombRange;
  }

  move(wall, bomb, player) {
    if (this.propertie == "normal") {
      return;
    }

    let dx = 0,
      dy = 0;

    if (this.propertie == "directionRight" && this.x <= MAP.endRight - 16) {
      if (
        this.bombType == 6 &&
        (!this.collide(wall, bomb, player, this.x + 2, this.y) ||
          this.x == MAP.endRight - 16)
      ) {
        this.propertie = "directionLeft";
        dx = -2;
      } else if (this.collide(wall, bomb, player, this.x + 2, this.y)) {
        dx = 2;
      } else {
        this.propertie = "normal";
      }
    } else if (this.propertie == "directionLeft" && this.x >= MAP.startLeft) {
      if (
        this.bombType == 6 &&
        (!this.collide(wall, bomb, player, this.x - 2, this.y) ||
          this.x == MAP.startLeft)
      ) {
        this.propertie = "directionRight";
        dx = 2;
      } else if (this.collide(wall, bomb, player, this.x - 2, this.y)) {
        dx = -2;
      } else {
        this.propertie = "normal";
      }
    } else if (this.propertie == "directionUp" && this.y >= MAP.startTop) {
      if (
        this.bombType == 6 &&
        (!this.collide(wall, bomb, player, this.x, this.y - 2) ||
          this.y == MAP.startTop)
      ) {
        this.propertie = "directionDown";
        dy = 2;
      } else if (this.collide(wall, bomb, player, this.x, this.y - 2)) {
        dy = -2;
      } else {
        this.propertie = "normal";
      }
    } else if (
      this.propertie == "directionDown" &&
      this.y <= MAP.endBottom - 16
    ) {
      if (
        this.bombType == 6 &&
        (!this.collide(wall, bomb, player, this.x, this.y + 2) ||
          this.y == MAP.endBottom - 16)
      ) {
        this.propertie = "directionUp";
        dy = -2;
      } else if (this.collide(wall, bomb, player, this.x, this.y + 2)) {
        dy = 2;
      } else {
        this.propertie = "normal";
      }
    }

    this.x += dx;
    this.y += dy;
    return true;
  }

  collide(bomb, wall, player, x, y) {
    for (let b of bomb) {
      if (b.id != this.id && this.isCollisions(x, y, b)) {
        return false;
      }
    }
    for (let i = 0; i < wall.length; i++) {
      if (this.isCollisions(x, y, wall[i])) {
        return false;
      }
    }
    for (let p in player) {
      if (
        this.isCollisions(x, y, player[p]) &&
        this.collisionCenter(x, y, player[p])
      ) {
        return false;
      }
    }
    return true;
  }

  isCollisions(x, y, b) {
    return (
      x < b.x + b.width && x + 16 > b.x && y < b.y + b.height && y + 16 > b.y
    );
  }

  collisionCenter(x, y, b) {
    if (this.propertie == "directionRight" && x + 16 > b.x + 2) return false;
    if (this.propertie == "directionLeft" && x < b.x + b.width - 2)
      return false;
    if (this.propertie == "directionUp" && y < b.y + b.height - 2) return false;
    if (this.propertie == "directionDown" && y + 16 > b.y + 2) return false;
    return true;
  }

  changePropertie(dx, dy) {
    if (dx == 1) {
      this.propertie = "directionRight";
    }
    if (dx == -1) {
      this.propertie = "directionLeft";
    }
    if (dy == 1) {
      this.propertie = "directionDown";
    }
    if (dy == -1) {
      this.propertie = "directionUp";
    }
  }

  // moveBounceSide() {
  //   let xinit = this.x;
  //   let yinit = this.y;
  //   this.intervalId = setInterval(() => {
  //     if (this.x < xinit + 32) {
  //       this.x += 1;
  //       this.y = -Math.abs(14 * Math.sin((Math.PI / 32) * this.x)) + yinit;
  //       socket.emit("bombMove", this);
  //       console.log(this.x);
  //     } else {
  //       clearInterval(this.intervalId);
  //       this.intervalId = null;
  //     }
  //   }, 20);
  // }

  // moveBounceUp(wall, bomb, player) {
  //   y += 1;
  //   x = Math.abs(14 * Math.cos((Math.PI / 32) * y)) + xinit; // Calculer la position sur l'axe y en fonction de la fonction mathématique
  //   // if (x + dx > canvas.width - width || x + dx < 0) {
  //   //   dx = -dx;
  //   // }
  // }
}

export default Bomb;
