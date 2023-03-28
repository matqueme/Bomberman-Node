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

export const HTMLADMIN = `
<div class="title">Partie</div>
        <div class="param">
          <div class="titleParam">
            Position :
            <span class="tooltiptext"
              >Déterminer la position au démarage</span
            >
          </div>
          <div class="textParam">
            <button class="btnParam" id="btnPositionGauche">&#8249;</button>
            <div id="position">Fixe</div>
            <button class="btnParam" id="btnPositionDroite">&#8250;</button>
          </div>
        </div>

        <div class="param">
          <div class="titleParam">
            Map :
            <span class="tooltiptext"
              >Choisissez la map avec des fonctionalitées unique</span
            >
          </div>
          <div class="textParam">
            <button class="btnParam" id="btnMapGauche">&#8249;</button>
            <div class="map">
              <img src="./img/map-icon/Map-1.png" alt="map" id="map" />
              <div id="mapTxt">Normal</div>
              <span class="tooltiptext2" id="tooltiptext2"
                >Il s'agit de la carte de base.</span
              >
            </div>
            <button class="btnParam" id="btnMapDroite">&#8250;</button>
          </div>
        </div>

        <div class="param">
          <div class="titleParam">
            Round :
            <span class="tooltiptext"
              >Détermine le nombre de victoire pour gagner</span
            >
          </div>
          <div class="textParam">
            <button class="btnParam" id="">&#8249;</button>
              <div id="textPosition">3</div>
            <button class="btnParam" id="">&#8250;</button>
          </div>
        </div>

        <div class="param">
          <div class="titleParam">
            Temps :
            <span class="tooltiptext"
              >Détermine la fin de la partie (Si la muraille est désactivé
              il peut y avoir match nul)</span
            >
          </div>
          <div class="textParam">
            <button class="btnParam" id="">&#8249;</button>
              <div id="textPosition">2:00</div>
            <button class="btnParam" id="">&#8250;</button>
          </div>
        </div>

        <div class="param">
          <div class="titleParam">
            Muraille :
            <span class="tooltiptext"
              >Des blocs tomberons d'en haut jusqu'à la mort des
              joueurs</span
            >
          </div>
          <div class="textParam">
            <button class="btnParam" id="">&#8249;</button>
              <div id="textPosition">Oui</div>
            <button class="btnParam" id="">&#8250;</button>
          </div>
        </div>

        <div class="param">
          <div class="titleParam">
            Crâne :
            <span class="tooltiptext"
              >Détermine si le malus "Crâne" est activé</span
            >
          </div>
          <div class="textParam">
            <button class="btnParam" id="">&#8249;</button>
              <div id="textPosition">Oui</div>
            <button class="btnParam" id="">&#8250;</button>
          </div>
        </div>

        <div class="param">
          <div class="titleParam">
            Jackpot :
            <span class="tooltiptext"
              >Determine si le jackpot est activé</span
            >
          </div>
          <div class="textParam">
            <button class="btnParam" id="">&#8249;</button>
              <div id="textPosition">Non</div>
            <button class="btnParam" id="">&#8250;</button>
          </div>
        </div>

        Team :
        <div class="team">
          <div
            class="white"
            id="div1"
            ondrop="drop(event)"
            ondragover="allowDrop(event)"
          >
            <img
              src="img/head/1.png"
              alt="white"
              draggable="true"
              ondragstart="drag(event)"
              id="drag1"
            />
          </div>
          <div
            class="black"
            id="div2"
            ondrop="drop(event)"
            ondragover="allowDrop(event)"
          >
            <img
              src="img/head/2.png"
              alt="black"
              draggable="true"
              ondragstart="drag(event)"
              id="drag2"
            />
          </div>

          <div
            class="red"
            id="div3"
            ondrop="drop(event)"
            ondragover="allowDrop(event)"
          >
            <img
              src="img/head/3.png"
              alt="red"
              draggable="true"
              ondragstart="drag(event)"
              id="drag3"
            />
          </div>
          <div
            class="blue"
            id="div4"
            ondrop="drop(event)"
            ondragover="allowDrop(event)"
          >
            <img
              src="img/head/4.png"
              alt="blue"
              draggable="true"
              ondragstart="drag(event)"
              id="drag4"
            />
          </div>
          <div
            class="green"
            id="div5"
            ondrop="drop(event)"
            ondragover="allowDrop(event)"
          >
            <img
              src="img/head/5.png"
              alt="green"
              draggable="true"
              ondragstart="drag(event)"
              id="drag5"
            />
          </div>
          <div
            class="yellow"
            id="div6"
            ondrop="drop(event)"
            ondragover="allowDrop(event)"
          >
            <img
              src="img/head/6.png"
              alt="yellow"
              draggable="true"
              ondragstart="drag(event)"
              id="drag6"
            />
          </div>
          <div
            class="pink"
            id="div7"
            ondrop="drop(event)"
            ondragover="allowDrop(event)"
          >
            <img
              src="img/head/7.png"
              alt="pink"
              draggable="true"
              ondragstart="drag(event)"
              id="drag7"
            />
          </div>
          <div
            class="cyan"
            id="div8"
            ondrop="drop(event)"
            ondragover="allowDrop(event)"
          >
            <img
              src="img/head/8.png"
              alt="cyan"
              draggable="true"
              ondragstart="drag(event)"
              id="drag8"
            />
          </div>
        </div>

        <div id="start"></div>
`;

export const HTMLPLAYER = `
<div class="title">Partie</div>
        <div class="param">
          <div class="titleParam">
            Position :
            <span class="tooltiptext"
              >Déterminer la position au démarage</span
            >
          </div>
          <div class="textParam2">
            <div id="position">Fixe</div>
          </div>
        </div>

        <div class="param">
          <div class="titleParam">
            Map :
            <span class="tooltiptext"
              >Choisissez la map avec des fonctionalitées unique</span
            >
          </div>
          <div class="textParam2">
            <div class="map">
              <img src="./img/map-icon/Map-1.png" alt="map" id="map" />
              <div id="mapTxt">Normal</div>
              <span class="tooltiptext2" id="tooltiptext2"
                >Il s'agit de la carte de base.</span
              >
            </div>
          </div>
        </div>

        <div class="param">
          <div class="titleParam">
            Round :
            <span class="tooltiptext"
              >Détermine le nombre de victoire pour gagner</span
            >
          </div>
          <div class="textParam2">
              <div id="textPosition">3</div>
          </div>
        </div>

        <div class="param">
          <div class="titleParam">
            Temps :
            <span class="tooltiptext"
              >Détermine la fin de la partie (Si la muraille est désactivé
              il peut y avoir match nul)</span
            >
          </div>
          <div class="textParam2">
              <div id="textPosition">2:00</div>
          </div>
        </div>

        <div class="param">
          <div class="titleParam">
            Muraille :
            <span class="tooltiptext"
              >Des blocs tomberons d'en haut jusqu'à la mort des
              joueurs</span
            >
          </div>
          <div class="textParam2">
              <div id="textPosition">Oui</div>
          </div>
        </div>

        <div class="param">
          <div class="titleParam">
            Crâne :
            <span class="tooltiptext"
              >Détermine si le malus "Crâne" est activé</span
            >
          </div>
          <div class="textParam2">
              <div id="textPosition">Oui</div>
          </div>
        </div>

        <div class="param">
          <div class="titleParam">
            Jackpot :
            <span class="tooltiptext"
              >Determine si le jackpot est activé</span
            >
          </div>
          <div class="textParam2">
              <div id="textPosition">Non</div>
          </div>
        </div>

        Team :
        <div class="team">
          <div
            class="white"
            id="div1"
          >
            <img
              src="img/head/1.png"
              alt="white"
            />
          </div>
          <div
            class="black"
            id="div2"
          >
            <img
              src="img/head/2.png"
              alt="black"
            />
          </div>

          <div
            class="red"
            id="div3"
          >
            <img
              src="img/head/3.png"
              alt="red"
            />
          </div>
          <div
            class="blue"
            id="div4"
          >
            <img
              src="img/head/4.png"
              alt="blue"
            />
          </div>
          <div
            class="green"
            id="div5"
          >
            <img
              src="img/head/5.png"
              alt="green"
            />
          </div>
          <div
            class="yellow"
            id="div6"
          >
            <img
              src="img/head/6.png"
              alt="yellow"
            />
          </div>
          <div
            class="pink"
            id="div7"
          >
            <img
              src="img/head/7.png"
              alt="pink"
            />
          </div>
          <div
            class="cyan"
            id="div8"
          >
            <img
              src="img/head/8.png"
              alt="cyan"
            />
          </div>
        </div>

        <div id="start"></div>
`;
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
