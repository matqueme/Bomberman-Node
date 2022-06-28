class bomb {
    constructor(param) {
        this.x = param.x; //position x
        this.y = param.y; //position y
        this.width = 16; // taille image
        this.height = 16; //taille image
        this.frameX = param.frameX; // position de la frame X
        this.frameY = param.type; // position de la frame y
        this.frameCount = param.frameCount; // nombre de frame pour l'animation

        this.frameExplosionX = param.frameExplosionX; // position de la frame X pour l'explosion
        this.frameExplosionY = param.frameExplosionY; // position de la frame y pour l'explosion
        this.frameExplosionCount = param.frameExplosionCount; // nombre de frame pour l'animation pour l'explosion

        this.power = param.power; //puissance
        this.timePlace = param.timePlace; //moment ou la bombe est placer (date time)
        this.timeExplode = param.timeExplode; //temps avant l'explosion en s
        this.explode = param.explode; //si ca a exploser ou pas
        this.explode2 = param.explode2; //si ca a exploser ou pas pour savoir si on a deja exploser les mur/joueur/bombe
        this.type = param.type; //type de la bombe (experimental)

        this.numberplayer = param.numberplayer; // numero du player qui a place la bombe
    }

    //return

    get getNumberPlayer() {
        return this.numberplayer;
    }

    get getx() {
        return this.x;
    }

    get gety() {
        return this.y;
    }

    get getpower() {
        return this.power;
    }

    get getexplode() {
        return this.explode;
    }

    //verification du temps avant l'explosion
    timeBeforeExplosion() {
        let now = new Date();
        let diffTime = Math.abs(now - this.timePlace) / 1000;
        if (diffTime > this.timeExplode) {
            this.explode = true;
        }
    }

    //forcer l'explosion si on bombe explose avec une autre
    forceExplosion() {
        this.explode = true;
    }

    //savoir si l'explosion a eu lieu
    isExplosed() {
        if (this.explode) {
            return true;
        } else {
            return false;
        }
    }

    //savoir si l'explosion a eu lieu pour les animation
    isExplosed2() {
        if (this.explode2) {
            return false;
        } else {
            this.explode2 = true;
            return true;
        }
    }

    //modifie le sprite de l'image a afficher
    handleBombFrame() {
        //Faire bouger
        if (this.frameX < this.frameCount) {
            this.frameX++;
        }
        if (this.frameX > this.frameCount - 1) {
            this.frameX = 0;
        }
    }

    //afficher les explosion en frame
    handleExplosionFrame() {
        //console.log(this.frameExplosionX);
        if (this.frameExplosionX < this.frameExplosionCount) {
            this.frameExplosionX++;
        }
    }

    //si on a finis l'affichage des explosion
    explosionFrameIsDone() {
        if (this.frameExplosionX > this.frameExplosionCount - 1) {
            return true;
        }
        return false;
    }

    //affiche les bombes sur la map !
    drawbomb(constmapleft, constmapUp, ctx, img) {
        ctx.drawImage(img, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x * 64 + constmapleft, this.y * 64 + constmapUp - 12, this.width * 4, this.height * 4);

    }

    //affiche les explosions
    drawExplosion(constmapleft, constmapUp, ctx, img) {
        ctx.drawImage(img, (this.frameExplosionX - 1) * this.width, this.frameExplosionY * this.height, this.width, this.height, this.x * 64 + constmapleft, this.y * 64 + constmapUp, this.width * 4, this.height * 4);
    }


}

export default bomb;