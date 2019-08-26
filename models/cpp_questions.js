const mongoose =require("mongoose");
const  Schema = mongoose.Schema;
const cpp_questions = new Schema({

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

module.exports =cppquestions =mongoose.model("cpp_questions",cpp_questions)