function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  var element = document.getElementById(data);
  var target = ev.target;
  // Insérez le nouvel élément avant l'élément existant si le drop est effectué sur une image existante
  if (target.childElementCount <= 3) {
    // Insérez le nouvel élément avant l'élément existant si le drop est effectué sur une image existante
    if (target.tagName === "IMG") {
      if (target.parentNode.childElementCount <= 3) {
        target.parentNode.insertBefore(element, target);
      }
    } else {
      target.appendChild(element);
    }
  }
}
