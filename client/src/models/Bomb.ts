//Bomb.ts
enum BombType {
  NormalBomb = 1,
  RemoteBomb = 2,
  PassThroughBomb = 3,
  PowerBomb = 4,
  LandMineBomb = 5,
  RubberBomb = 6,
  DangerousBomb = 7,
}

interface BombParams {
  x: number;
  y: number;
  bombType: BombType;
}

class Bomb {
  x: number;
  y: number;
  bombType: BombType;
  propertie: string = "normal";
  frameX: number = 0;
  frameY: number;
  frameCount: number;

  constructor(params: BombParams) {
    this.x = params.x;
    this.y = params.y;
    this.bombType = params.bombType;
    this.frameY = params.bombType - 1;
    this.frameCount = this.calculateFrameCount(params.bombType);
  }

  private calculateFrameCount(bombType: BombType): number {
    switch (bombType) {
      case BombType.NormalBomb:
      case BombType.PassThroughBomb:
      case BombType.PowerBomb:
      case BombType.RubberBomb:
      case BombType.DangerousBomb:
        return 3;
      case BombType.RemoteBomb:
        return 4;
      case BombType.LandMineBomb:
        return 2;
      default:
        return 0;
    }
  }

  updateSprite() {
    if (this.frameX < this.frameCount - 1) this.frameX++;
    else this.frameX = 0;
  }
}

export default { Bomb, BombType };
