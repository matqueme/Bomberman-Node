const http = require('http');
const express = require('express');
const socketio = require('socket.io');


const { Users } = require('./users.js');
const { Settings } = require('./setting.js');

const app = express();

app.use(express.static(`${__dirname}/../client`));

const server = http.createServer(app);
const io = socketio(server);

let users = new Users();
let settings = new Settings();

const listener = (...args) => {
    console.log(args);
}

io.on('connection', (sock) => {
    //CONNECTION
    sock.on('join', (param) => {
        //creer setting de la room
        settings.addSetting(param.room, 0);
        users.removeUser(sock.id);
        //si la partie a pas commencer
        if (settings.getState(param.room) == 0) {
            //il join la room
            sock.join(param.room);
            //on ajoute un le joueur a la liste
            users.addUser(sock.id, param.name, param.room);
            //on lui dis qu'il est admin
            if (users.getAdmin(sock.id)) {
                io.to(sock.id).emit('admin', true);
            }
            //on envoie la liste des joueur et leur numéro
            io.to(param.room).emit('updateUserList', users.getUserList(param.room), users.getPlayerNumberList(param.room))
            io.to(sock.id).emit('playernumberTab', users.getNumberPlayer(sock.id));

        }
    });

    //CHAT
    sock.on('message', (text) => {
        let user = users.getUser(sock.id);
        if (user && text) {
            sock.broadcast.to(user.room).emit('message', text, user, 0);
            io.to(user.id).emit('message', text, user, 1);
        }
    }); //envoie un message a tt le monde meme l'utilisateur

    //CHANGE LE JOUEUR
    sock.on('changePlayerNumber', (param) => {
        let user = users.getUser(sock.id);
        if (settings.getState(user.room) == 0 && user) {
            users.setChangePlayerNumber(sock.id, param);
            io.to(user.room).emit('updateUserList', users.getUserList(user.room), users.getPlayerNumberList(user.room))
            io.to(sock.id).emit('playernumberTab', users.getNumberPlayer(sock.id));
        }
    });

    //Modify player parameter
    sock.on('editplayer', (param, nbtab) => {
        let user = users.getUser(sock.id);
        if (user) {
            settings.updatePlayer(nbtab, user.room, param);
            io.to(sock.id).emit('paramGame', settings.getAllOfAGame(user.room), nbtab);
        }
    });

    //Add bomb to settings
    sock.on('addBomb', (x, y) => {
        let user = users.getUser(sock.id);
        if (user) {
            settings.placeBomb(user.room, x, y, user);
            io.to(user.room).emit('bombParam', settings.getAllOfAGame(user.room).tabBomb);
        }
    });

    //START
    sock.on('start', () => {
        let user = users.getUser(sock.id);
        if (user && settings.getState(user.room) == 0) {
            settings.changeState(user.room, 1);
            settings.start(user.room, users.getPlayerNumberList(user.room));
            io.to(user.room).emit('paramGame', settings.getAllOfAGame(user.room));
            io.to(user.room).emit('stateGame', 1);
        }
    });

    //DECONNECTION
    sock.on('disconnect', () => {
        let user = users.removeUser(sock.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room), users.getPlayerNumberList(user.room));
            //envoie une requete au nouvel admin
            let aa = users.getUserAdmin(user.room);
            io.to(aa).emit('admin', true);
            //remove les settings si y a plus personne dans la room
            if (users.getUserList(user.room).length == 0) {
                settings.removeSetting(user.room);
                settings.removeGame(user.room);
            }
        }

    });

});

server.on('error', (err) => {
    console.error(err);
});


server.listen(3000, '0.0.0.0', function() {
    console.log('Listening to port:  ' + 3000);
})