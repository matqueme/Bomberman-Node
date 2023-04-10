class Bomb {
  constructor(param) {
    this.x = param.x;
    this.y = param.y;
    this.bombType = param.bombType;
    this.propertie = "normal";
    this.frameX = 0; // position de la frame X
    this.frameY = param.bombType - 1; // position de la frame y
    if (
      param.bombType === 1 ||
      param.bombType === 3 ||
      param.bombType === 4 ||
      param.bombType === 6 ||
      param.bombType === 7
    ) {
      this.frameCount = 3; // nombre de frame pour l'animation
    }
    if (param.bombType === 2) {
      this.frameCount = 4; // nombre de frame pour l'animation
    }
    if (param.bombType === 5) {
      this.frameCount = 2; // nombre de frame pour l'animation
    }
  }

  updateSprite() {
    if (this.frameX < this.frameCount - 1) this.frameX++;
    else this.frameX = 0;
  }
}

export default Bomb;
