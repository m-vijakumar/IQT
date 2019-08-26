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

           res.render("dashboard",{
                user:user.username,
                score :user.score

           }) 
         }


    })
})


module.exports = router;