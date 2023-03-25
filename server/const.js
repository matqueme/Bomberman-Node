//map constant values
export const MAP = {
  //map size
  width: 240,
  innerHeight: 144,
  startTop: 32,
  startLeft: 8,
  endBottom: 368,
  endRight: 248,

  widthMap: 256, //taille de la map
  heightMap: 384, //taille de la map
};

//player constant values
export const PLAYER = {
  width: 20, // taille image
  height: 30, //taille image
  widthPlayer: 16, //taille du joueur
  heightPlayer: 16, //taille du joueur
};

export const PLAYERSTARTPOSITIONS = {
  player1: [
    {
      x: MAP.startLeft,
      y: MAP.startTop,
    },
    {
      x: MAP.startLeft + 16,
      y: MAP.startTop,
    },
    {
      x: MAP.startLeft,
      y: MAP.startTop + 16,
    },
  ],
  player2: [
    {
      x: MAP.endRight - 16,
      y: MAP.startTop,
    },
    {
      x: MAP.endRight - 32,
      y: MAP.startTop,
    },
    {
      x: MAP.endRight - 16,
      y: MAP.startTop + 16,
    },
  ],
  player3: [
    {
      x: MAP.startLeft,
      y: MAP.startTop + 8 * 16,
    },
    {
      x: MAP.startLeft,
      y: MAP.startTop + 7 * 16,
    },
    {
      x: MAP.startLeft + 16,
      y: MAP.startTop + 8 * 16,
    },
  ],
  player4: [
    {
      x: MAP.endRight - 16,
      y: MAP.startTop + 8 * 16,
    },
    {
      x: MAP.endRight - 16,
      y: MAP.startTop + 7 * 16,
    },
    {
      x: MAP.endRight - 32,
      y: MAP.startTop + 8 * 16,
    },
  ],
  player5: [
    {
      x: MAP.startLeft,
      y: MAP.endBottom - 16 - 8 * 16,
    },
    {
      x: MAP.startLeft,
      y: MAP.endBottom - 16 - 7 * 16,
    },
    {
      x: MAP.startLeft + 16,
      y: MAP.endBottom - 16 - 8 * 16,
    },
  ],
  player6: [
    {
      x: MAP.endRight - 16,
      y: MAP.endBottom - 16 - 8 * 16,
    },
    {
      x: MAP.endRight - 16,
      y: MAP.endBottom - 16 - 7 * 16,
    },
    {
      x: MAP.endRight - 32,
      y: MAP.endBottom - 16 - 8 * 16,
    },
  ],
  player7: [
    {
      x: MAP.startLeft,
      y: MAP.endBottom - 16,
    },
    {
      x: MAP.startLeft + 16,
      y: MAP.endBottom - 16,
    },
    {
      x: MAP.startLeft,
      y: MAP.endBottom - 32,
    },
  ],
  player8: [
    {
      x: MAP.endRight - 16,
      y: MAP.endBottom - 16,
    },
    {
      x: MAP.endRight - 32,
      y: MAP.endBottom - 16,
    },
    {
      x: MAP.endRight - 16,
      y: MAP.endBottom - 32,
    },
  ],
};

export const WALL = {
  walls: [
    { x: 8, y: 32 + 144, width: 16, height: 16, destructible: false },
    { x: 8, y: 32 + 176, width: 16, height: 16, destructible: false },
    { x: 8 + 224, y: 32 + 144, width: 16, height: 16, destructible: false },
    { x: 8 + 224, y: 32 + 176, width: 16, height: 16, destructible: false },
  ],
};

const xValues = [16, 48, 80, 112, 144, 176, 208];
const yValues = [16, 48, 80, 112, 144, 160, 176, 208, 240, 272, 304];

//faire un quadrillage de 7x4
for (let i = 0; i < xValues.length; i++) {
  for (let j = 0; j < yValues.length; j++) {
    WALL.walls.push({
      x: 8 + xValues[i],
      y: 32 + yValues[j],
      width: 16,
      height: 16,
      destructible: false,
    });
  }
}
