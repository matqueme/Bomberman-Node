class item {

    //proba :
    /* 7 items
    fire = 20
    fire *2 = 10
    fire low = 10
    speed = 20
    slow =10
    bomb = 20
    bomb less = 10
    */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 16; // taille image
        this.height = 16; //taille image
        this.frameX = 0;
        this.frameY = 0;
        this.type = 0;
        this.proba = [20, 10, 10, 20, 10, 20, 10];
    }

    get getX() {
        return this.x;
    }

    get getY() {
        return this.y;
    }

    get getType() {
        return this.type;
    }

    generateteItem() {
        let random = Math.random() * 100;
        let i = 0;
        let probaCalcul = 0;
        while (i < this.proba.length) {
            if ((random > probaCalcul) && (random < probaCalcul + this.proba[i])) {
                this.type = i;
                if (i < 9) {
                    this.frameX = i;
                } else if (i < 15) {
                    this.frameX = i - 9;
                    this.frameY = 1;
                } else if (i < 18) {
                    this.frameX = i - 15;
                    this.frameY = 2;
                } else {
                    this.frameX = i - 18;
                    this.frameY = 3;
                }
                i = this.proba.length + 1;
            } else {
                probaCalcul = probaCalcul + this.proba[i];
                i++;
            }

        }
    }

    //affiche les bombes sur la map !
    drawItem(constmapleft, constmapUp, ctx, img) {
        ctx.drawImage(img, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x * 64 + constmapleft, this.y * 64 + constmapUp, this.width * 4, this.height * 4);
    }


}

export default item;