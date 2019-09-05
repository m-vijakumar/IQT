const express=require("express")
const bodyparser=require("body-parser");
const jsonwt= require("jsonwebtoken");
const key =require("../../setup/connect").sceret;
const router =express.Router();

router.use(bodyparser.urlencoded({extended:false}));
router.use(bodyparser.json());

const newusers=require("../../models/question");
const NewUser=require("../../models/newuser");

router.get("/start/:types",(req,res)=>{

    jsonwt.verify(req.cookies.auth_t, key, (err, user)=> {
        if(err){
            console.log(err);
            res.redirect("/login");

        }else{  
            console.log(user)
            jsonwt.sign({payload:user.username,examtype :req.params.types},
            key,
            {expiresIn : 670},
            (err, token) => {
                res.cookie("exam_t", token, { maxAge: 670000 });
                if(!err){ res.redirect("/test")}
               else{
                   res.redirect("/login");
               }
                 
                  
              })

        }

 
});

})
router.get("/",(req,res)=>{

    jsonwt.verify(req.cookies.exam_t, key, (err, decoded)=> {
        if(err){
            console.log(err);
            res.redirect("/dashboard");

        }else{  
            newusers.find({qid:decoded.examtype})
            .then(profile =>{
                console.log(profile);
                res.render("test",{
                allques: profile
                })       
            })
            .catch(err => {
                console.log(err)
                res.render("error",{status:404} )
                
            })
        }
      });  
})
router.post("/score",(req,res)=>{
    let sum =0;
    jsonwt.verify(req.cookies.exam_t, key, (err, user)=> {
        if(err){
            res.redirect("/dashboard");
        }else{
                
        let i=0;
        
            let all =req.body;
            console.log(all)
            let answers= [];
            var allans =Object.keys(all).map((key)=>{return [all[key]]})
            newusers.find({qid:user.examtype})
            .then(profile =>{
            answers=profile
            for(i=0;i<answers.length;i++){
                let cn =answers[i].ans;
                let yn =allans[i];
                console.log(allans[i]);console.log(answers[i]);
                if( cn ==  yn ){
                    sum=sum+1;
                }
            }
            
            
             res.redirect(`/test/result/${sum}`)

        })
                .catch(err => {
                console.log(err)
                res.render("error",{status:404} )
                
            })
        
      }
    
    })


})    


router.get("/result/:sum",(req,res)=>{


    jsonwt.verify(req.cookies.exam_t, key, (err, user)=> {
        if(err){
            res.redirect("/dashboard");
        }else{
            console.log(user.payload)
            NewUser.findOneAndUpdate({username:user.payload},
                 {$inc: {score:req.params.sum}},(err)=>{
                if(err){
                    console.log(err)
                }
               
            });
            
            res.clearCookie("exam_t");
            res.render("result",{
                mark:req.params.sum
            })
            
        }

    })

})

module.exports =router;