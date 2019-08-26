const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
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
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
const db =require("./setup/connect").mongodbURL;
mongoose 
.connect(db,{useNewUrlParser :true})
.then(()=> console.log("mongodb connected"))
.catch(err =>console.log(err))

app.use(cookieparser());
app.get('/',(req, res)=> {
    res.render('home');
});


app.listen(port,console.log('server is running.....'));

module.exports=app;