const express=require("express");
const router =express.Router();
const bodyparser=require("body-parser");
const cookie =require("cookie-parser");

const jsonwt =require("jsonwebtoken");
const key =require("../../setup/connect").sceret;
router.use(bodyparser.urlencoded({extended:false}));
router.use(bodyparser.json());
router.use(cookie());
const NewUser= require("../../models/newuser");


router.get("/login",(req,res)=>{

    res.render("login");

});

// @type    POST
//@route    /login/auth
// @desc    starting router
// @access  PUBLIC

router.post("/auth/login",(req,res)=>{
    const username=req.body.name;
    const password =req.body.password;
    if(username){
        
    }else{
        return res.render("login",{
            usermessage:"enter username"
        });
    }
    NewUser.findOne({username})
    .then(user =>{
        console.log(user)
        if(!user){
            res.render("login",{
                message : "Invalied UserName or Password"
            })
        }
        const pass =user.password;
        if(password == pass){
            const payload ={
                username: user.username,
                score :user.score
       
           };
            jsonwt.sign(payload,
                key,
                {expiresIn :9000000},
                (err, token) => {
                    res.cookie("auth_t", token, { maxAge: 90000000 });
                    res.redirect("/dashboard")  
                }
                )
        }else{
            res.render("login",{
                message : "Invalied UserName or Password"
            })
        }

    })

    .catch(err =>{
        res.render("login",{
            message : `${err}`
        })
    })
})


router.get("/register",(req,res)=>{

    res.render("register");
})

router.post("/auth/register",(req,res)=>{
    if(req.body.username){
    }else{
        return res.render("register",{
            usermessage : "Enter UserName"
    });
    }
    if(req.body.email){
    }else{
        return res.render("register",{
            emailmessage : "Enter Email"
    });
    }
    if(req.body.password){
    }else{
        return res.render("register",{
            passmessage : "Enter Password"
    });
    }
    NewUser.findOne({username:req.body.username})
        .then( new_user=>{

            console.log(new_user)
            if(new_user){
                return res.render("register",{
                    message:'User is Already Registered'});
            }else{
               console.log(req.body.email)
               const userdetails ={
                username: req.body.username,
                score : 0
       
           };
                const Newuser =new NewUser({
                    username: req.body.username,
                    email:req.body.email,
                    password: req.body.password,
                   profile_link:`localhost:5000/profile/${req.body.username}`,
                    score :0
                })
                Newuser
                .save()
                .then(     jsonwt.sign(userdetails, key,
                    { expiresIn: 3000 },
                     (err, token) => {
                    res.cookie("auth_t", token, { maxAge: 900000 });
                    if(!err){ res.redirect("/dashboard")}
                   else{
                       res.render("error");
                   }
                     
                  })
                  
                  )
                .catch(err => console.log(err));
               

         

                }
        })
     .catch(err =>{
        console.log(err)
        res.render("register",{
             message :'internal error .......'
         });
        
       
});



})

router.get("/logout", (req, res) => {
    jsonwt.verify(req.cookies.auth_t, key, (err, user) => {
      if (user) {
        res.clearCookie("auth_t").redirect("/")
        
      } else {
        return res
        .status(404)
        .render("home")
      }
    });
  });


module.exports =router;