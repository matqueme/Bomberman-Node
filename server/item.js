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
}

module.exports = { item }