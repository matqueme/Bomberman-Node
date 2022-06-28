class explosion {
    constructor(x, y, frameCount, type) {
        this.x = x; //position x
        this.y = y; //position y
        this.width = 16; // taille image
        this.height = 16; //taille image
        this.frameX = 0; // position de la frame X
        this.frameY = type; // si c'est Left right etc...
        this.frameCount = frameCount; // nombre de frame pour l'animation
    }

    //return
    get getx() {
        return this.x;
    }

    get gety() {
        return this.y;
    }

    //modifie le sprite de l'image a afficher
    handleExplosionFrame() {
        //Faire bouger
        if (this.frameX < this.frameCount) {
            this.frameX++;
        }
    }

    //si on a finis l'affichage des explosion
    explosionFrameIsDone() {
        if (this.frameX > this.frameCount - 1) {
            return true;
        }
        return false;
    }

    //affiche les explosions
    drawExplosion(constmapleft, constmapUp, ctx, img) {
        ctx.drawImage(img, (this.frameX - 1) * this.width, this.frameY * this.height, this.width, this.height, this.x * 64 + constmapleft, this.y * 64 + constmapUp, this.width * 4, this.height * 4);
    }


}

export default explosion;