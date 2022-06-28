class players {
    constructor(param) {

        /*POSITON AND NUMBER*/
        this.numberplayer = param.numberplayer;
        this.x = param.x; //position x en start
        this.y = param.y; //position y en start

        this.boxX = param.boxX;
        this.boxY = param.boxY;

        /*DISPLAY PARAMETER*/
        this.width = param.width; // taille image
        this.height = param.height; //taille image
        this.frameX = param.frameX; // position de la frame X
        this.frameY = param.frameY; // position de la frame y
        this.frameCount = param.frameCount; // nombre de frame pour l'animation
        this.moving = param.moving; //si il bouge

        /*HITBOX*/
        this.hitboxX = param.hitboxX; // position de la hitbox largeur
        this.hitboxY = param.hitboxY; // position de la hitbox hauteur
        this.hitboxWH = param.hitboxWH; //  hitbox en longeur/largeur

        /*SPEED*/
        this.speed = param.speed; //vitesse de déplacement

        /*MAP CONSTANT*/
        this.w = 960; //240
        this.h = 576; //144
        this.startUp = 128; //32
        this.startLeft = 32; //8
        this.endBottom = 1472; //368
        this.endRight = 992; //248

        /*BOMB PARAMETER*/
        this.bombtype = param.bombtype;
        this.bombpower = param.bombpower;
        this.bombnumber = param.bombnumber;
    }

    /*RETURN*/

    get getNumberPlayer() {
        return this.numberplayer;
    }

    get getNumberPlayer() {
        return this.numberplayer;
    }

    get getbombnumber() {
        return this.bombnumber;
    }

    get getbombpower() {
        return this.bombpower;
    }

    get getBoxX() {
        return this.boxX;
    }

    get getBoxY() {
        return this.boxY;
    }

    /*------------------------ANNIMATION ------------------------------ */
    //pour placer la hitbox du joueur, tout les calculs se font en fonction de la hitbox
    hitboxPlayer() {
        this.hitboxX = this.x + (2 * 4); //calcul pour le positionement
        this.hitboxY = this.y + (18 * 4); //calcul pour le positionement
    }

    //affiche le personnage sur la map
    drawSprite(ctx, img) {
        ctx.drawImage(img, 0, 0, this.hitboxWH / 4, this.hitboxWH / 4, this.hitboxX, this.hitboxY, this.hitboxWH, this.hitboxWH);
        ctx.drawImage(img, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width * 4, this.height * 4);
    }

    //pour animation si il bouge ou pas 
    handlePlayerFrame() {
        this.calculBoxPlayer();
        //remmettre a 0
        if (this.moving && this.frameX < 3) {
            this.frameX = 3;
        } else if (!this.moving && this.frameX > 3) {
            this.frameX = 0;
        }
        //Faire bouger
        if (this.frameX < this.frameCount - 1) {
            this.frameX++;
        } else {
            if (this.moving) {
                this.frameX = 3;
            } else {
                this.frameX = 0;
            }
        }
    }

    calculBoxPlayer() {
        this.boxX = Math.round((this.x - 24) / (16 * 4));
        this.boxY = Math.round((this.y - 56) / (16 * 4));
        // console.log("x : ", this.boxX, "y : ", this.boxY);
    }

    /*--------------------------MOUVEMENT DU PERSONNAGE--------------------------- */

    //fonction pour deplacer le joueur
    moveLeft() {
        if ((this.hitboxX > this.startLeft)) {
            this.x -= this.speed;
        }
        this.moveLeftAnimation();
    }

    moveRight() {
        if ((this.hitboxX + this.hitboxWH < this.endRight)) {
            this.x += this.speed;
        }
        this.moveRightAnimation();
    }

    moveUp() {
        if ((this.hitboxY > this.startUp)) {
            this.y -= this.speed;
        }
        this.moveUpAnimation();
    }

    moveDown() {
        if (this.hitboxY + this.hitboxWH < this.endBottom) {
            this.y += this.speed;
        }
        this.moveDownAnimation();
    }

    /*----------------------------ANIMATION/AFFICHAGE------------------------------ */
    moveLeftAnimation() {
        this.frameY = 2;
        this.moving = true;
        this.frameCount = 9;
    }

    moveRightAnimation() {
        this.frameY = 3;
        this.moving = true;
        this.frameCount = 9;
    }

    moveUpAnimation() {
        this.frameY = 4;
        this.moving = true;
        this.frameCount = 9;
    }

    moveDownAnimation() {
        this.frameY = 1;
        this.moving = true;
        this.frameCount = 9;
    }

    /*-----------------------COLLIDE WALL---------------------- */
    collideWallLeft(x, y, xTab, yTab, map) {
        //gestion de la sortie du tableau
        if (xTab - 1 <= 0 && map[yTab][xTab - 1] == '0') {
            this.moveLeft(this.startLeft);
        } else {
            //si c'est un bon nombre entier on peut aller a gauche
            if (map[yTab][xTab - 1] == '0' && Number.isInteger(y)) {
                this.moveLeft(this.startLeft);
            } else if (!Number.isInteger(y)) {
                if (y < Math.round(y)) {
                    //si la case a gauche est un vide on dessend
                    if (map[yTab][xTab - 1] == '0') {
                        this.moveDown(this.endBottom);
                    } else {
                        //si la case au dessus a gauche est vide on monte sinon on anime seulement
                        if (map[yTab - 1][xTab - 1] == '0') {
                            this.moveUp(this.startUp);
                        } else {
                            this.moveLeftAnimation();
                        }
                    }
                    //si on est plus en bas
                } else {
                    //si le mur a gauche est un mur
                    if (map[yTab][xTab - 1] == 'x' || map[yTab][xTab - 1] == 'b') {
                        //si y a rien au dessus a gauche on monte
                        if (map[yTab - 1][xTab - 1] == '0') {
                            this.moveUp(this.startUp);
                            //sinon on anime 
                        } else {
                            this.moveLeftAnimation();
                        }
                        //sinon on descend
                    } else {
                        this.moveDown(this.endBottom);
                    }
                }
            } else {
                //gestion des bombes en dessous du joueur 
                //si on est sur une bombe
                if (map[Math.round(y)][Math.round(x)] == 'b') {
                    //si y a pas de bombe a gauche ou se deplace
                    if (map[Math.round(y)][Math.round(x) - 1] == '0') {
                        this.moveLeft(this.startLeft);
                        //si y a une bombe mais qu'on es plus a droite de la bombe on peut aller jusqu'au centre de la case
                    } else if (map[Math.round(y)][Math.round(x) - 1] == 'b' && x > Math.round(x)) {
                        this.moveLeft(this.startLeft);
                        //sinon on met juste l'animation
                    } else {
                        this.moveLeftAnimation();
                    }
                } else {
                    this.moveLeftAnimation();
                }
            }
        }
    }

    collideWallRight(x, y, xTab, yTab, map) {
        if (xTab + 1 >= map[0].length) {
            this.moveRight(this.endRight);
        } else {
            //si c'est un bon nombre entier on peut aller a gauche
            if (map[yTab][xTab + 1] == '0' && Number.isInteger(y)) {
                this.moveRight(this.endRight);
                //sinon on on monte ou on descend jusqu'a avoir un nb entier
            } else if (!Number.isInteger(y)) {
                if (y < Math.round(y)) {
                    if (map[yTab][xTab + 1] == '0') {
                        this.moveUp(this.startUp);
                    } else {
                        if (map[yTab + 1][xTab + 1] == '0') {
                            this.moveDown(this.endBottom);
                        } else {
                            this.moveRightAnimation();
                        }
                    }
                } else {
                    if (map[yTab][xTab + 1] == 'x' || map[yTab][xTab + 1] == 'b') {
                        if (map[yTab + 1][xTab + 1] == '0') {
                            this.moveDown(this.endBottom);
                        } else {
                            this.moveRightAnimation();
                        }
                    } else {
                        this.moveUp(this.startUp);
                    }
                }
            } else {
                //gestion des bombes en dessous du joueur 
                //si on est sur une bombe
                if (map[Math.round(y)][Math.round(x)] == 'b') {
                    //si y a pas de bombe a droite ou se deplace
                    if (map[Math.round(y)][Math.round(x) + 1] == '0') {
                        this.moveRight(this.endRight);
                        //si y a une bombe mais qu'on es plus a gauche de la bombe on peut aller jusqu'au centre de la case
                    } else if (map[Math.round(y)][Math.round(x) + 1] == 'b' && x < Math.round(x)) {
                        this.moveRight(this.endRight);
                        //sinon on met juste l'animation
                    } else {
                        this.moveRightAnimation();
                    }
                } else {
                    this.moveRightAnimation();
                }
            }
        }
    }

    collideWallUp(x, y, xTab, yTab, map) {
        if (yTab - 1 <= 0) {
            this.moveUp(this.startUp);
        } else {
            if (map[yTab - 1][xTab] == '0' && Number.isInteger(x)) {
                this.moveUp(this.startUp);
            } else if (!Number.isInteger(x)) {
                if (x > Math.round(x)) {
                    if (map[yTab - 1][xTab] == '0') {
                        this.moveRight(this.endRight);
                    } else {
                        if (map[yTab - 1][xTab - 1] == '0') {
                            this.moveLeft(this.startLeft);
                        } else {
                            this.moveUpAnimation();
                        }
                    }
                } else {
                    if (map[yTab - 1][xTab] == 'x' || map[yTab - 1][xTab] == 'b') {
                        if (map[yTab - 1][xTab - 1] == '0') {
                            this.moveLeft(this.startLeft);
                        } else {
                            this.moveUpAnimation();
                        }
                    } else {
                        this.moveRight(this.endRight);
                    }
                }
            } else {
                //gestion des bombes en dessous du joueur 
                //si on est sur une bombe
                if (map[Math.round(y)][Math.round(x)] == 'b') {
                    //si y a pas de bombe a droite ou se deplace
                    if (map[Math.round(y) - 1][Math.round(x)] == '0') {
                        this.moveUp(this.startUp);
                        //si y a une bombe mais qu'on es plus a gauche de la bombe on peut aller jusqu'au centre de la case
                    } else if (map[Math.round(y) - 1][Math.round(x)] == 'b' && y > Math.round(y)) {
                        this.moveUp(this.startUp);
                        //sinon on met juste l'animation
                    } else {
                        this.moveUpAnimation();
                    }
                } else {
                    this.moveUpAnimation();
                }
            }
        }
    }


    collideWallDown(x, y, xTab, yTab, map) {
        if (yTab + 1 >= map.length) {
            this.moveDown(this.endBottom);
        } else {
            if (map[yTab + 1][xTab] == '0' && Number.isInteger(x)) {
                this.moveDown(this.endBottom);
            } else if (!Number.isInteger(x)) {
                if (x > Math.round(x)) {
                    if (map[yTab + 1][xTab] == '0') {
                        this.moveLeft(this.startLeft);
                    } else {
                        if (map[yTab + 1][xTab + 1] == '0') {
                            this.moveRight(this.endRight);
                        } else {
                            this.moveDownAnimation();
                        }
                    }
                } else {
                    if (map[yTab + 1][xTab] == 'x' || map[yTab + 1][xTab] == 'b') {
                        if (map[yTab + 1][xTab + 1] == '0') {
                            this.moveRight(this.endRight);
                        } else {
                            this.moveDownAnimation();
                        }
                    } else {
                        this.moveLeft(this.startLeft);
                    }
                }
            } else {
                //gestion des bombes en dessous du joueur 
                //si on est sur une bombe
                if (map[Math.round(y)][Math.round(x)] == 'b') {
                    //si y a pas de bombe a droite ou se deplace
                    if (map[Math.round(y) + 1][Math.round(x)] == '0') {
                        this.moveDown(this.endBottom);
                        //si y a une bombe mais qu'on es plus a gauche de la bombe on peut aller jusqu'au centre de la case
                    } else if (map[Math.round(y) + 1][Math.round(x)] == 'b' && y < Math.round(y)) {
                        this.moveDown(this.endBottom);
                        //sinon on met juste l'animation
                    } else {
                        this.moveDownAnimation();
                    }
                } else {
                    this.moveDownAnimation();
                }
            }
        }
    }

    /*---------------------POWER--------------------- */
    powerUp(type) {
        switch (type) {
            case 0:
                if (this.bombpower < 8) {
                    this.bombpower += 1;
                }
                break;

            case 1:
                if (this.bombpower < 8) {
                    this.bombpower = 8;
                }
                break;
            case 2:
                if (this.bombpower > 1) {
                    this.bombpower -= 1;
                }
                break;

            case 3:
                this.speed += 1;
                break;

            case 4:
                if (this.speed > 1) {
                    this.speed -= 1;
                }
                break;

            case 5:
                this.bombnumber += 1;
                break;

            case 6:
                if (this.bombnumber > 1) {
                    this.bombnumber -= 1;
                }
                break;

            default:
                console.log("N'existe pas")
                break;
        }
    }

}

export default players