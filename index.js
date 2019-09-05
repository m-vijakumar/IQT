const express = require('express');
const app = express();
// const socket = require(socket.io);
// const https = require('https').Server(app);
// const io = require('socket.io')(https);
// const server = require('http').createServer(app);
// const io = require('socket.io').listen(server);
const messageModel = require("./models/MessageModel");
const User = require("./models/newuser");

const jsonwt = require("jsonwebtoken");
const bodyparser =require('body-parser');
const mongoose =require('mongoose');
const cookieparser =require('cookie-parser')
const key =require("./setup/connect").sceret;
const port =process.env.PORT || 5000;
const ejs =require("ejs");

let uchat =[];

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
mongoose.set('useNewUrlParser', true);
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
            messageModel
            .findOne({id__: "1234"})
            .then(r => {
              r.messages.forEach(element => {
                uchat.push(element);
              });
              res.render('chat.ejs',{
                username:user.username,
                messages: r.messages
            });
            })
            .catch(er => console.log(er));
        } else {
          return res
          .status(404)
          .redirect("/login")
        }
      });
})


//  https.listen(port, function() {
//     console.log('listening on *:5000');
// });
// http.listen(port, function() {
//     console.log('listening on *:8080');
// //  });
//  app.listen(port,console.log('server is running.....'));

 const server = app.listen(port,console.log('server is running.....'));
const io = require("socket.io")(server);


 io.on('connection', function(socket) {

  socket.emit('note','note')
  for(var i=0 ;i<uchat.length;i++){

    socket.emit("pre",'<strong>' + uchat[i].messageBy + '</strong>: ' + uchat[i].message)
    
  }


    socket.on('username', function(username) {
      uchat=[];
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', function(message) {
        messageModel.findOne({id__: "1234"}).then(r => {
          r.messages.push({
            message: message,
            messageBy: socket.username
          });
        r.save();
        }).catch(er => console.log(er));

        User
        .findOne({username : socket.username})
        .then(user => {
          user.messages.push(message);
          user.save();
        })
        .catch(er => console.log(er));
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
      });
  });


module.exports=app;
