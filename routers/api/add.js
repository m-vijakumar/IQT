const express = require("express");
const router =express.Router();
const addques =require("../../models/question");


router.get("/",(req,res)=>{

    res.render("add");
})
router.post("/ques",(req,res)=>{

    const Add = new addques ({
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
                        message : "question added"
                    })
                })
    .catch(err =>{
             console.log(err)
             res.render("add",{
                message : "question not added"
            }) 
                   })
})


module.exports =router;