const mongoose =require("mongoose");
const  Schema = mongoose.Schema;
const newquestion = new Schema({

    qid:{
        type :Number,
        require:true
    },
    question:{
        type :String,
        require :true
    },
    op1:{
        type :String,
        require: true
    },
    op2:{
        type:String,
        require:true
    },
    op3:{
        type:String,
        require:true
    },
    op4:{
        type :String,
        require:true
    },
    ans:{
        type:String,
        require :true
    }
});

module.exports =Newquestions =mongoose.model("questions",newquestion)