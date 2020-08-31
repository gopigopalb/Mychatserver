const express = require("express");
const app = express();
const port = 8082;
const mongoose = require("mongoose");
const usermodel = require("./models/users");
const chatmodel = require("./models/chat");
const connection = require("./config");
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const chat = require("./schemas/chat");
const server = app.listen(port, () => console.log('App listening on port' + port));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


app.post("/loginuser",(req,res) => {
    usermodel.loginUser(req.body).then(item => {
        if(item && item.length>0) {
            res.status(200).send(item[0]);
        } else {
            res.status(201).send({message:"invalid email address or password"});
        }
    })
    .catch(error => {
        res.status(400).send("unable to tind user")
    });
});

app.post("/registeruser",(req,res) => {
    usermodel.userRegistration(req.body).then(item => {
        if(item) {
            res.status(200).send(item);
        } else {
            res.status(201).send({message:"cannot register..."});
        }

    })
    .catch(err => {
        res.status(400).send("unable to register");
    });

    });

app.get("/userslist",(req, res) => {
    
    usermodel.userList().then(item => {
        if(item) {
            res.status(200).send(item);
        } else {
            res.status(201).send({message: " No records found"});
        }
    })
    .catch(err => {
        res.status(400).send(err);
    });
});

const websocket = socketio(server);
websocket.on('connection', function (socket) {
    socket.on('chatMessage', (data) => {
        chatmodel.chatInsert(data)
    });

    socket.on('getMessage', (data) => {
        let chatlist = chatmodel.getChatList(data).then(chatlist => {
            console.log(chatlist,"chatlist")
            socket.emit('receiveMessage',chatlist);
        });

    });
})

