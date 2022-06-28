class players {
    constructor(x, y, numberplayer) {

        /*POSITON AND NUMBER*/
        this.numberplayer = numberplayer;
        this.x = x; //position x en start
        this.y = y; //position y en start

        this.boxX = 0;
        this.boxY = 0;

        /*DISPLAY PARAMETER*/
        this.width = 20; // taille image
        this.height = 30; //taille image
        this.frameX = 0; // position de la frame X
        this.frameY = 1; // position de la frame y
        this.frameCount = 3; // nombre de frame pour l'animation
        this.moving = false; //si il bouge

        /*HITBOX*/
        this.hitboxX = 0; // position de la hitbox largeur
        this.hitboxY = 0; // position de la hitbox hauteur
        this.hitboxWH = 16 * 4; //  hitbox en longeur/largeur

        /*SPEED*/
        this.speed = 2; //vitesse de déplacement

        /*BOMB PARAMETER*/
        this.bombtype = 0;
        this.bombpower = 1;
        this.bombnumber = 1;
    }
}
module.exports = { players }