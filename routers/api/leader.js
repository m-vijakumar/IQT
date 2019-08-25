const express=require("express")
const bodyparser=require("body-parser");
const jsonwt= require("jsonwebtoken")
const router =express.Router();

const key =require("../../setup/connect").sceret;
router.use(bodyparser.urlencoded({extended:false}));
router.use(bodyparser.json());

const newusers=require("../../models/newuser");

router.get("/",(req,res)=>{

let allscores =[];
    jsonwt.verify(req.cookies.auth_t, key, (err, decoded)=> {
        if(err){
            console.log(err);
            res.redirect("/login");

        }else{  
    newusers.find({})
    .then(rank =>{
       let allranks =[]
       // console.log(rank)
       rank.forEach(a => {
           let b={user:a.username,score :a.score }
        allscores.push(b)
       });
       allranks=allscores.sort((a,b)=>{
            return b.score -a.score;
       });
       allranks.forEach(a => {
        

    });
    console.log(allranks)
    res.render("leaderboard",{
        alluser:allranks,
        user1:decoded.username,
        len:allranks.length
    });
    })
    .catch(err => {
        console.log(err)
        res.render("error",{status:404} )  })

    
    }
    
})
})
   
module.exports =router;