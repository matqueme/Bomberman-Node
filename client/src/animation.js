const btnGauche = document.getElementById("btnPositionGauche");
const btnDroite = document.getElementById("btnPositionDroite");
const position = document.getElementById("position");

function changeTexte(nameText, tabValue, append) {
  let newText;

  //add text to the div
  if (document.getElementById(nameText).innerHTML === tabValue[0])
    newText = tabValue[1];
  else newText = tabValue[0];

  document.getElementById(nameText).remove();
  const texte = document.createElement("div");

  texte.innerHTML = newText;

  texte.setAttribute("id", nameText);

  document.getElementById(append).appendChild(texte);
}

function apparitionGauche(nameText) {
  //add class to the div text
  document.getElementById(nameText).classList.add("apparition-gauche");
}

function apparitionDroite(nameText) {
  document.getElementById(nameText).classList.add("apparition-droite");
}

/*--------------Btn------------------ */

btnGauche.addEventListener("click", () => {
  let tabValue = ["Fixe", "Hasard"];
  changeTexte("textPosition", tabValue, "position");
  apparitionGauche("textPosition");
});

btnDroite.addEventListener("click", () => {
  let tabValue = ["Fixe", "Hasard"];
  changeTexte("textPosition", tabValue, "position");
  apparitionDroite("textPosition");
});
