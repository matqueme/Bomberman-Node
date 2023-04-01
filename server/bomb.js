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

export default Bomb;
