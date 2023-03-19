//map constant values
export const MAP = {
  //map size
  width: 960, //240
  innerHeight: 576, //144
  startTop: 128, //32
  startLeft: 32, //8
  endBottom: 1472, //368
  endRight: 992, //248

  widthMap: 16 * 256, //taille de la map
  heightMap: 16 * 384, //taille de la map
};

//player constant values
export const PLAYER = {
  width: 20, // taille image
  height: 30, //taille image
  widthPlayer: 16 * 4, //taille du joueur
  heightPlayer: 16 * 4, //taille du joueur
};

export const WALL = {
  wall: [
    { x: 32, y: 128 + 144 * 4, width: 64, height: 64 },
    { x: 32, y: 128 + 176 * 4, width: 64, height: 64 },
    { x: 32 + 224 * 4, y: 128 + 144 * 4, width: 64, height: 64 },
    { x: 32 + 224 * 4, y: 128 + 176 * 4, width: 64, height: 64 },
  ],
};

const xValues = [16, 48, 80, 112, 144, 176, 208];
const yValues = [16, 48, 80, 112, 144, 160, 176, 208, 240, 272, 304];

//faire un quadrillage de 7x4
for (let i = 0; i < xValues.length; i++) {
  for (let j = 0; j < yValues.length; j++) {
    WALL.wall.push({
      x: 32 + xValues[i] * 4,
      y: 128 + yValues[j] * 4,
      width: 64,
      height: 64,
    });
  }
}
