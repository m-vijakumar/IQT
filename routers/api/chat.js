
const express = require('express');
const router = express.Router();
const http = require('http').Server(router);
const bodyparser=require("body-parser");
const jsonwt= require("jsonwebtoken")
const port =require("../../index").port;
const io = require('socket.io')(http);
const key =require("../../setup/connect").sceret;

router.get('/',(req, res) =>{
    jsonwt.verify(req.cookies.auth_t, key, (err, user) => {
        if (user) {
            res.render('chat.ejs',{
                username:user.username
            });
          
        } else {
          return res
          .status(404)
          .render("home")
        }
      });
});

io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

});


module.exports = router;
