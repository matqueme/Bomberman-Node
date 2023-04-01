import { MAP } from "./const.js";

class Wall {
  constructor(x, y, type) {
    this.x = x + MAP.startLeft;
    this.y = y + MAP.startTop;
    this.width = 16;
    this.height = 16;
    this.destructible = type;
  }
}

export default Wall;
