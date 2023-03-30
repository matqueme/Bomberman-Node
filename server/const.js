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

export const CENTEROBJECTS = [
  { x: MAP.startLeft + 32, y: MAP.startTop + 16 },
  { x: MAP.startLeft + 32, y: MAP.startTop + 32 },
  { x: MAP.startLeft + 32, y: MAP.startTop + 48 },
  { x: MAP.startLeft + 16, y: MAP.startTop + 32 },
  { x: MAP.startLeft + 48, y: MAP.startTop + 32 },

  { x: MAP.endRight - 48, y: MAP.startTop + 16 },
  { x: MAP.endRight - 48, y: MAP.startTop + 32 },
  { x: MAP.endRight - 48, y: MAP.startTop + 48 },
  { x: MAP.endRight - 32, y: MAP.startTop + 32 },
  { x: MAP.endRight - 64, y: MAP.startTop + 32 },

  { x: MAP.startLeft + 32, y: MAP.startTop + 80 },
  { x: MAP.startLeft + 32, y: MAP.startTop + 96 },
  { x: MAP.startLeft + 32, y: MAP.startTop + 112 },
  { x: MAP.startLeft + 16, y: MAP.startTop + 96 },
  { x: MAP.startLeft + 48, y: MAP.startTop + 96 },

  { x: MAP.endRight - 48, y: MAP.startTop + 80 },
  { x: MAP.endRight - 48, y: MAP.startTop + 96 },
  { x: MAP.endRight - 48, y: MAP.startTop + 112 },
  { x: MAP.endRight - 32, y: MAP.startTop + 96 },
  { x: MAP.endRight - 64, y: MAP.startTop + 96 },

  { x: MAP.startLeft + 32, y: MAP.endBottom - 32 },
  { x: MAP.startLeft + 32, y: MAP.endBottom - 48 },
  { x: MAP.startLeft + 32, y: MAP.endBottom - 64 },
  { x: MAP.startLeft + 16, y: MAP.endBottom - 48 },
  { x: MAP.startLeft + 48, y: MAP.endBottom - 48 },

  { x: MAP.endRight - 48, y: MAP.endBottom - 32 },
  { x: MAP.endRight - 48, y: MAP.endBottom - 48 },
  { x: MAP.endRight - 48, y: MAP.endBottom - 64 },
  { x: MAP.endRight - 32, y: MAP.endBottom - 48 },
  { x: MAP.endRight - 64, y: MAP.endBottom - 48 },

  { x: MAP.startLeft + 32, y: MAP.endBottom - 96 },
  { x: MAP.startLeft + 32, y: MAP.endBottom - 112 },
  { x: MAP.startLeft + 32, y: MAP.endBottom - 128 },
  { x: MAP.startLeft + 16, y: MAP.endBottom - 112 },
  { x: MAP.startLeft + 48, y: MAP.endBottom - 112 },

  { x: MAP.endRight - 48, y: MAP.endBottom - 96 },
  { x: MAP.endRight - 48, y: MAP.endBottom - 112 },
  { x: MAP.endRight - 48, y: MAP.endBottom - 128 },
  { x: MAP.endRight - 32, y: MAP.endBottom - 112 },
  { x: MAP.endRight - 64, y: MAP.endBottom - 112 },
];

export const MAPS = [
  {
    name: "Normal",
    tooltip: "Il s'agit de la carte de base.",
    source: "background-1.png",
    wall: "unbreakableWall-1.png",
    generatioWall: 1,
    wallType: 1,
  },
  {
    name: "Bouclier",
    tooltip:
      "Dans ce niveau vous avez un bouclier qui vous protège des bombes pendant quelques secondes.",
    source: "background-1.png",
    wall: "unbreakableWall-1.png",
    generatioWall: 1,
    wallType: 1,
  },
  {
    name: "Crâne",
    tooltip:
      "Dans ce niveau des hordes de crâne apparaissent, on ne peut pas le désactiver depuis les options.",
    source: "background-2.png",
    wall: "unbreakableWall-2.png",
    generatioWall: 1,
    wallType: 3,
  },
  {
    name: "Mystère",
    tooltip:
      "Dans ce niveau les objets sont remplacés par des points d'interrogation. Si vous n'avez pas de chance les choses risquent de mal tourner.",
    source: "background-1.png",
    wall: "unbreakableWall-1.png",
    generatioWall: 1,
    wallType: 1,
  },
  {
    name: "Vite vite",
    tooltip:
      "Dans ce niveau la partie commence à la vitesse maximum. Attention à ne pas vous faire sauter !",
    source: "background-3.png",
    wall: "unbreakableWall-3.png",
    generatioWall: 1,
    wallType: 2,
  },
  {
    name: "Tunnels",
    tooltip:
      "Dans ce niveau de nombreux tunnels permettent de se cacher. Ayer bien en tête la position de vos adversaires.",
    source: "background-4.png",
    wall: "unbreakableWall-4.png",
    generatioWall: 2, //ne pas mettre le milieu du tunnel
    wallType: 1,
  },
  {
    name: "Unipont",
    tooltip:
      "Ce niveau ne dispose que d'un tunnel reliant la partie du haut de la partie du bas. Vous avancez ou vous attendez ?",
    source: "background-5.png",
    wall: "unbreakableWall-5.png",
    generatioWall: 16,
    wallType: 1,
  },
  {
    name: "Tripont",
    tooltip:
      "Ce niveau dispose de trois tunnels reliant la partie du haut de la partie du bas. Le coup de pied peut être bien pratique.",
    source: "background-6.png",
    wall: "unbreakableWall-6.png",
    generatioWall: 17,
    wallType: 1,
  },
  {
    name: "Tapis",
    tooltip:
      "Ce niveau dispose de tapis qui déplacent aussi bien les joueurs que les bombes.",
    source: "background-7.png",
    wall: "unbreakableWall-7.png",
    generatioWall: 3, //ne pas générer sur les tapis
    wallType: 1,
  },
  {
    name: "Tremplin",
    tooltip:
      "Dans ce niveau des tremplins vous amènent en haut ou en bas de la carte.",
    source: "background-8.png",
    wall: "unbreakableWall-8.png",
    generatioWall: 4, //ne pas générer sur les tremplins
    wallType: 1,
  },
  {
    name: "Détour",
    tooltip:
      "Les flèches de ce niveau vous permettent de détourner une bombe lancée.",
    source: "background-9.png",
    wall: "unbreakableWall-9.png",
    generatioWall: 5, //ne pas générer sur les tunnels et les flèches
    wallType: 1,
  },
  {
    name: "Va-et-vient",
    tooltip:
      "Un va-et-vient vous permet de lancer des bombes ainsi que des joueurs situé de l'autre côté. Si vous les expédiez hors de la carte ils seront éliminés.",
    source: "background-10.png",
    wall: "unbreakableWall-10.png",
    generatioWall: 6, //ne pas générer sur les balacoirs
    wallType: 1,
  },
  {
    name: "Maxi",
    tooltip:
      "Un niveau extrême sans bloc mou et dans lequel vous débuttez avec la puissance maximum.",
    source: "background-11.png",
    wall: "unbreakableWall-11.png",
    generatioWall: 7, //pas de génération de blocs
    wallType: 1,
  },
  {
    name: "Buffet",
    tooltip:
      "Dans ce niveau une montagne d'object vous attend au centre du niveau.",
    source: "background-12.png",
    wall: "unbreakableWall-12.png",
    generatioWall: 8, //pas de wall indesctructible et génération de blocs en cercle
    wallType: 1,
  },
  {
    name: "Mini",
    tooltip:
      "Dans ce niveau seul la partie du haut sert pour le combat. Si 8 joueurs combattent ce sera la cohue.",
    source: "background-13.png",
    wall: "unbreakableWall-13.png",
    generatioWall: 9, //wall indestructible que au dessus et génération avec emplacement au centre pour 4 personnages
    wallType: 1,
  },
  {
    name: "Inferno",
    tooltip: "Un niveau dangereux sans bloc durs. Attention aux explosions !",
    source: "background-14.png",
    wall: "unbreakableWall-14.png",
    generatioWall: 10, //pas de wall indestructible
    wallType: 1,
  },

  {
    name: "Spikes",
    tooltip:
      "Si vous touchez les piques, vous perdrez immédiatement. Faites bien attention.",
    source: "background-15.png",
    wall: "unbreakableWall-15.png",
    generatioWall: 11, //pas wall indestructible et génération normal
    wallType: 3,
  },
  {
    name: "Couronne",
    tooltip:
      "Le premier joueur à toucher la couronne situé dans la partie supérieur gagne la partie.",
    source: "background-16.png",
    wall: "unbreakableWall-16.png",
    generatioWall: 12, // ne pas fénérer trop bas et ni trop haut
    wallType: 4,
  },
  {
    name: "Diadème",
    tooltip:
      "Dans le niveau Diadème, il n'y a pas de blocs mou et vous démarrez avec la puissance maximum.",
    source: "background-20.png",
    wall: "unbreakableWall-20.png",
    generatioWall: 13, //génération normal bloc durs et bloc mou partie au dessus (peut être comme 12 ?)
    wallType: 4,
  },
  {
    name: "Manège",
    tooltip:
      "Dans ce niveau la couronne se déplace sur un tapis. Essayez de deviner où elle ira.",
    source: "background-17.png",
    wall: "unbreakableWall-17.png",
    generatioWall: 14, //ne aps générer trop haut ni sur les tapis
    wallType: 4,
  },
  {
    name: "Blocs",
    tooltip: "Le joueur qui peint le plus de blocs gagne la partie.",
    source: "background-18.png",
    wall: "unbreakableWall-18.png",
    generatioWall: 1,
    wallType: 1,
  },
  {
    name: "Blocs 2",
    tooltip:
      "Les flèches de ce niveau peuvent détourner une bombe lancée. Vous avez des coups de pieds dès le début.",
    source: "background-19.png",
    wall: "unbreakableWall-19.png",
    generatioWall: 15, //ne pas générer sur les flèches
    wallType: 1,
  },
  {
    name: "Zombie",
    tooltip:
      "Vous pouvez réssuciter aussitôt avoir perdu, mais le sol que vous avez peint à votre couleur reprend sa couleur d'origine.",
    source: "background-18.png",
    wall: "unbreakableWall-18.png",
    generatioWall: 1,
    wallType: 1,
  },
  {
    name: "Aléatoire",
    tooltip:
      "Le niveau est choisit aléatoirement parmi les 23 niveaux disponibles.",
    source: "background-1.png",
    wall: "unbreakableWall-1.png",
    generatioWall: 1,
    wallType: 1,
  },
];

export const CARPET = [
  {
    x: 0,
    y: 0,
  },
];

for (let i = 0; i < 16; i++) {
  CARPET.push({
    x: MAP.startLeft + 32,
    y: MAP.startTop + 48 + i * 16,
    type: "up",
  });
}

for (let i = 0; i < 16; i++) {
  CARPET.push({
    x: MAP.endRight - 48,
    y: MAP.startTop + 32 + i * 16,
    type: "down",
  });
}

for (let i = 0; i < 10; i++) {
  CARPET.push({
    x: MAP.startLeft + 32 + i * 16,
    y: MAP.startTop + 32,
    type: "right",
  });
}

for (let i = 0; i < 10; i++) {
  CARPET.push({
    x: MAP.startLeft + 48 + i * 16,
    y: MAP.endBottom - 48,
    type: "left",
  });
}

for (let i = 0; i < 6; i++) {
  CARPET.push({
    x: MAP.startLeft + 64 + i * 16,
    y: MAP.startTop + 64,
    type: "right",
  });
}

for (let i = 0; i < 6; i++) {
  CARPET.push({
    x: MAP.startLeft + 80 + i * 16,
    y: MAP.startTop + 128,
    type: "left",
  });
}

for (let i = 0; i < 4; i++) {
  CARPET.push({
    x: MAP.startLeft + 64,
    y: MAP.startTop + 80 + i * 16,
    type: "up",
  });
}

for (let i = 0; i < 4; i++) {
  CARPET.push({
    x: MAP.endRight - 80,
    y: MAP.startTop + 64 + i * 16,
    type: "down",
  });
}

//
for (let i = 0; i < 6; i++) {
  CARPET.push({
    x: MAP.startLeft + 64 + i * 16,
    y: MAP.startTop + 64 + 128,
    type: "right",
  });
}

for (let i = 0; i < 6; i++) {
  CARPET.push({
    x: MAP.startLeft + 80 + i * 16,
    y: MAP.startTop + 128 + 128,
    type: "left",
  });
}

for (let i = 0; i < 4; i++) {
  CARPET.push({
    x: MAP.startLeft + 64,
    y: MAP.startTop + 80 + 128 + i * 16,
    type: "up",
  });
}

for (let i = 0; i < 4; i++) {
  CARPET.push({
    x: MAP.endRight - 80,
    y: MAP.startTop + 64 + 128 + i * 16,
    type: "down",
  });
}

export const TRAPDOOR = [
  { x: MAP.startLeft + 32, y: MAP.startTop + 32 },
  { x: MAP.endRight - 48, y: MAP.startTop + 32 },
  { x: MAP.startLeft + 32, y: MAP.startTop + 96 },
  { x: MAP.endRight - 48, y: MAP.startTop + 96 },
  { x: MAP.startLeft + 32, y: MAP.endBottom - 48 },
  { x: MAP.endRight - 48, y: MAP.endBottom - 48 },
  { x: MAP.startLeft + 32, y: MAP.endBottom - 112 },
  { x: MAP.endRight - 48, y: MAP.endBottom - 112 },
];

export const ARROWGROUND1 = [
  { x: MAP.startLeft + 32, y: MAP.startTop, type: "down" },
  { x: MAP.startLeft + 96, y: MAP.startTop + 32, type: "left" },
  { x: MAP.startLeft + 144, y: MAP.startTop + 32, type: "right" },
  { x: MAP.startLeft + 64, y: MAP.startTop + 64, type: "right" },
  { x: MAP.startLeft + 160, y: MAP.startTop + 64, type: "down" },
  { x: MAP.startLeft + 64, y: MAP.startTop + 96, type: "down" },
  { x: MAP.startLeft + 128, y: MAP.startTop + 96, type: "left" },
  { x: MAP.endRight - 16, y: MAP.startTop + 96, type: "left" },
  { x: MAP.startLeft + 96, y: MAP.startTop + 192, type: "up" },
  { x: MAP.endRight - 16, y: MAP.startTop + 192, type: "left" },
  { x: MAP.startLeft + 32, y: MAP.startTop + 256, type: "up" },
  { x: MAP.startLeft + 64, y: MAP.startTop + 256, type: "right" },
  { x: MAP.endRight - 48, y: MAP.startTop + 256, type: "up" },
];
