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

//tapis roulan
// export const TAPIS = [
//   {
//     x: MAP.startLeft + 32,
//     y: MAP.startTop + 32,
//     width: TAPIS.width,
//     height: TAPIS.height,
//     speed: TAPIS.speed,
//     direction: "right",
//   },
//   {
//     x: MAP.startLeft + 48,
//     y: MAP.startTop + 32,
//     width: TAPIS.width,
//     height: TAPIS.height,
//     speed: TAPIS.speed,
//     direction: "right",
//   },
//   {
//     x: MAP.startLeft + 64,
//     y: MAP.startTop + 32,
//     width: TAPIS.width,
//     height: TAPIS.height,
//     speed: TAPIS.speed,
//     direction: "down",
//   },
//   {
//     x: MAP.startLeft + 64,
//     y: MAP.startTop + 32,
//     width: TAPIS.width,
//     height: TAPIS.height,
//     speed: TAPIS.speed,
//     direction: "down",
//   },
//   {
//     x: MAP.startLeft + 64,
//     y: MAP.startTop + 48,
//     width: TAPIS.width,
//     height: TAPIS.height,
//     speed: TAPIS.speed,
//     direction: "down",
//   },
//   {
//     x: MAP.startLeft + 64,
//     y: MAP.startTop + 64,
//     width: TAPIS.width,
//     height: TAPIS.height,
//     speed: TAPIS.speed,
//     direction: "left",
//   },
//   {
//     x: MAP.startLeft + 48,
//     y: MAP.startTop + 64,
//     width: TAPIS.width,
//     height: TAPIS.height,
//     speed: TAPIS.speed,
//     direction: "left",
//   },
//   {
//     x: MAP.startLeft + 32,
//     y: MAP.startTop + 64,
//     width: TAPIS.width,
//     height: TAPIS.height,
//     speed: TAPIS.speed,
//     direction: "top",
//   },
//   {
//     x: MAP.startLeft + 32,
//     y: MAP.startTop + 48,
//     width: TAPIS.width,
//     height: TAPIS.height,
//     speed: TAPIS.speed,
//     direction: "top",
//   },
// ];

// for (let i = 0; i < 11; i++) {
//   const tapiss = {
//     x: MAP.startLeft + 16 * i + 32,
//     y: MAP.startTop + 32,
//     width: TAPIS.width,
//     height: TAPIS.height,
//     speed: TAPIS.speed,
//     direction: "right",
//   };
//   tapis.push(tapiss);
// }
//génération personalisé pour ne pas mettre sur les flèches
