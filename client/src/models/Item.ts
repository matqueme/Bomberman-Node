// item.ts
import { PROBA } from "../config";

enum ItemType {
  Fire = "fire",
  FireMax = "fireMax",
  FireLow = "fireLow",
}

interface ItemParams {
  x: number;
  y: number;
  width: number;
  height: number;
  frameX: number;
  frameY: number;
  type: ItemType;
}

class Item {
  x: number;
  y: number;
  width: number;
  height: number;
  frameX: number;
  frameY: number;
  type: ItemType;

  constructor(param: ItemParams) {
    this.x = param.x;
    this.y = param.y;
    this.width = param.width; // taille de l'item
    this.height = param.height; //taille de l'item
    this.frameX = param.frameX;
    this.frameY = param.frameY;
    this.type = param.type;
  }
}

export default Item;
