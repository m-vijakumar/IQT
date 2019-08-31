const express = require('express');
const app = express();
const https = require('https').Server(app);
const io = require('socket.io')(https);
// const http = require('http').Server(app);
// const io = require('socket.io')(http);
const jsonwt = require("jsonwebtoken");
const bodyparser =require('body-parser');
const mongoose =require('mongoose');
const cookieparser =require('cookie-parser')
const key =require("./setup/connect").sceret;
const port =process.env.PORT || 5000;
const ejs =require("ejs");
app.use(express.static("public"));
app.set("view engine",'ejs');

app.use("/",require("./routers/api/auth"));
app.use("/profile",require("./routers/api/profile"));
app.use("/leaderboard",require("./routers/api/leader"));
app.use("/dashboard",require("./routers/api/dashboard"));
app.use("/test",require("./routers/api/test"));
app.use("/admin",require("./routers/api/admin"));
//app.use("/chat",require("./routers/api/chat"))
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
const db =require("./setup/connect").mongodbURL;
mongoose 
.connect(db,{useNewUrlParser :true})
.then(()=> console.log("mongodb connected"))
.catch(err =>console.log(err))

app.use(cookieparser());
app.get('/',(req, res)=> {

    jsonwt.verify(req.cookies.auth_t, key, (err, user) => {
        if (user) {
            res.redirect("/dashboard");
          
        } else {
          return res
          .status(404)
          .redirect("/home")
        }
      });
    
});

app.get("/home",(req,res)=>{

    res.render("home")
})

app.get("/chat",(req,res)=>{

    jsonwt.verify(req.cookies.auth_t, key, (err, user) => {
        if (user) {
            res.render('chat.ejs',{
                username:user.username
            });
          
        } else {
          return res
          .status(404)
          .redirect("/login")
        }
      });
})

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

const server = https.listen(port, function() {
    console.log('listening on *:5000');
});
// const server = http.listen(port, function() {
//     console.log('listening on *:8080');
// });
// app.listen(port,console.log('server is running.....'));

module.exports=app;