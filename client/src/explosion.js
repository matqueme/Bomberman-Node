class explosion {
    constructor(param) {
        this.x = param.x; //position x
        this.y = param.y; //position y
        this.width = param.width; // taille image
        this.height = param.height; //taille image
        this.frameX = param.frameX; // position de la frame X
        this.frameY = param.frameY; // si c'est Left right etc...
        this.frameCount = param.frameCount; // nombre de frame pour l'animation
    }

    //affiche les explosions
    drawExplosion(constmapleft, constmapUp, ctx, img) {
        ctx.drawImage(img, (this.frameX - 1) * this.width, this.frameY * this.height, this.width, this.height, this.x * 64 + constmapleft, this.y * 64 + constmapUp, this.width * 4, this.height * 4);
    }


}

export default explosion;