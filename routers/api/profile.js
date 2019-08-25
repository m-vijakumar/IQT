const express=require("express")
const bodyparser=require("body-parser");
const jsonwt= require("jsonwebtoken")
const router =express.Router();

const key =require("../../setup/connect").sceret;
router.use(bodyparser.urlencoded({extended:false}));
router.use(bodyparser.json());

const newusers=require("../../models/newuser");
router.get("/",(req,res)=>{

    jsonwt.verify(req.cookies.auth_t, key, (err, user)=> {
        if(err){
            console.log(err);
            res.redirect("/login");

        }else{

           res.redirect(`/profile/${user.username}`) 
         }

    })
})
router.get("/:username",(req,res)=>{
    console.log(req.params.username)
    newusers.findOne({username:req.params.username})
    .then(profile =>{
        console.log(profile.email)
        res.render("profiles",
        {   name:profile.username,
            mail:profile.email,
            link:profile.profile_link
        })
    })
    .catch(err => {res.render("error",{status:404} )
        
    })
})

module.exports =router;