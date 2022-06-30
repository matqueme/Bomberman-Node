class bomb {
    constructor(x, y, timePlace, power, type, numberplayer) {
        this.x = x; //position x
        this.y = y; //position y
        this.width = 16; // taille image
        this.height = 16; //taille image
        this.frameX = 0; // position de la frame X
        this.frameY = type; // position de la frame y
        this.frameCount = 3; // nombre de frame pour l'animation

        this.frameExplosionX = 0; // position de la frame X pour l'explosion
        this.frameExplosionY = 10; // position de la frame y pour l'explosion
        this.frameExplosionCount = 4; // nombre de frame pour l'animation pour l'explosion

        this.power = power; //puissance
        this.timePlace = timePlace; //moment ou la bombe est placer (date time)
        this.timeExplode = 3; //temps avant l'explosion en s
        this.explode = false; //si ca a exploser ou pas
        this.explode2 = false; //si ca a exploser ou pas pour savoir si on a deja exploser les mur/joueur/bombe
        this.type = type; //type de la bombe (experimental)

        this.numberplayer = numberplayer; // numero du player qui a place la bombe
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

}

module.exports = { bomb }