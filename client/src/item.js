class item {

    //proba :
    /* 7 items
    fire = 20
    fire max = 10
    fire low = 10
    speed = 20
    slow =10
    bomb = 20
    bomb less = 10
    */
    constructor(param) {
        this.x = param.x;
        this.y = param.y;
        this.width = param.width; // taille image
        this.height = param.height; //taille image
        this.frameX = param.frameX;
        this.frameY = param.frameY;
        this.type = param.type;
        this.proba = [20, 10, 10, 20, 10, 20, 10];
    }

    //affiche les bombes sur la map !
    drawItem(constmapleft, constmapUp, ctx, img) {
        ctx.drawImage(img, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x * 64 + constmapleft, this.y * 64 + constmapUp, this.width * 4, this.height * 4);
    }


}

export default item;