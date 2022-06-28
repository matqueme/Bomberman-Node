class Users {
    constructor() {
        this.users = [];
    }

    //recupere un user
    getUser(id) {
        if (!this.users) {
            this.users = [];
        }
        return this.users.filter((user) => user.id === id)[0];
    }

    getUsersRoom(room) {
        if (!this.users) {
            this.users = [];
        }
        return this.users.filter((user) => user.room === room);
    }

    getNumberPlayer(id) {
        return this.users.filter((user) => user.id === id)[0].numberplayer;
    }

    //liste de tt les user de chaque room
    getPlayerNumberList(room) {
        let users = this.getUsersRoom(room);
        let numberplayerArray = users.map((user) => user.numberplayer);
        return numberplayerArray;
    }

    //userliste d'une room
    getUserList(room) {
        let users = this.getUsersRoom(room);
        let namesArray = users.map((user) => user.name);
        return namesArray;
    }

    //savoir si le user est un admin ou pas
    getAdmin(id) {
        //let a = ;
        if (this.getUser(id).admin == 1) {
            return true;
        } else {
            return false;
        }
    }

    //recuperer le user admin de la room
    getUserAdmin(room) {
        let user = this.getUsersRoom(room);
        let admin = 0;
        if (user.length >= 1)
            admin = user.filter((user) => user.admin === 1)[0].id;
        return admin;
    }

    getAllExpectUser(id) {
        return this.users.filter((user) => user.id !== id)
    }

    //get alluser
    getAll() {
        return this.users;
    }

    //choisir la numero du joueur en fonction des autre joueur deja dans la room
    setPlayerNumber(room) {
        const playertab = this.getPlayerNumberList(room);
        playertab.sort((a, b) => a - b);
        if (playertab[0] == 1) {
            if (playertab.length == 1) {
                return 2;
            }
            for (let i = 1; i < playertab.length; i++) {

                if (playertab[i] - playertab[i - 1] !== 1) {
                    return i + 1;
                }
            }
        } else {
            return 1;
        }
        return playertab.length + 1;
    }

    //change the number of the player
    setChangePlayerNumber(id, number) {
        let userparam = this.getUser(id);
        let room = userparam.room,
            name = userparam.name,
            admin = userparam.admin,
            numberplayer = number;
        let user = { id, name, room, admin, numberplayer };
        const index = this.users.findIndex(object => {
            return object.id === id;
        });
        this.users = this.getAllExpectUser(id);
        this.users.splice(index, 0, user);
    }

    //ajoute un joueur
    addUser(id, name, room) {
        let use = this.getUsersRoom(room);
        let admin = 0,
            numberplayer = 0;
        if (use.length == 0) {
            admin = 1;
            numberplayer = 1;
        } else {
            numberplayer = this.setPlayerNumber(room);
        }
        let user = { id, name, room, admin, numberplayer };
        this.users.push(user);
        return user;
    }

    //changer l'admin lors de la deconnection
    changeAdmin(room) {
        let userInRoom = this.getUsersRoom(room);
        let userInroom2 = userInRoom.filter((user) => user.admin !== 1);
        let id = userInroom2[0].id,
            name = userInroom2[0].name,
            numberplayer = userInroom2[0].numberplayer,
            admin = 1;
        let user = { id, name, room, admin, numberplayer };
        const index = this.users.findIndex(object => {
            return object.id === userInroom2[0].id;
        });
        this.users = this.users.filter((user) => user.id !== userInroom2[0].id);
        this.users.splice(index, 0, user);

    }

    //supprimer un user
    removeUser(id) {
        let user = this.getUser(id);
        if (user) {
            if (this.getAdmin(id)) {
                if (this.getUserList(user.room).length > 1)
                    this.changeAdmin(user.room);
            }
            this.users = this.getAllExpectUser(id);
        }
        return user;
    }

}

module.exports = { Users }