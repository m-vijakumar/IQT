const express = require("express");
const router =express.Router();
const addques =require("../../models/question");

const jwt =require("jsonwebtoken");
const key =require("../../setup/connect").sceret;

router.get("/",(req,res)=>{
    jwt.sign({payload:"kumar123vijay"},
    key,
    {expiresIn : 10*60},
    (err,token)=>{
        res.cookie("admin_t", token, { maxAge: 600000 });
        if(err){
            res.render("error")
        }else{  res.render("admin")  }
    })   
})

router.post("/auth",(req,res)=>{

    console.log(req.body.types)
    console.log(req.body.key)
    jwt.verify(req.cookies.admin_t ,key, (err,user)=>{

        if(err){

            res.render("error")

        }else{

            if(req.body.key == user.payload && req.body.types){
                
                res.render("add",{
                    types :req.body.types
                })

            }else{

                res.render("admin",{
                    message:"invalied key or plz selcet lang"
                });
            }
        }
    })

})
router.post("/ques/:types",(req,res)=>{

    if(req.body.types){
const Add = new addques ({
    qid:req.body.types,
    question:req.body.q,
    op1:req.body.op1,
    op2:req.body.op2,
    op3:req.body.op3,
    op4:req.body.op4,
    ans:req.body.ans

 } )
Add
.save()
.then(()=>{console.log("question is added")
                res.render("add",{
                    message : "question added",
                    types :req.body.types
                })
            })
.catch(err =>{
         console.log(err)
         res.render("add",{
            message : "question not added"
        }) 
               })

            }else{
                res.render("error");
            }
})


module.exports =router;