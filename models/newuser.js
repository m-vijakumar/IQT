const mongoose =require("mongoose");
const  Schema = mongoose.Schema;
const newuserschema = new Schema({

    username:{
        type: String,
        require:true
    },
    email:{
        type: String,
        require:true
    },
    password:{
        type: String,
        require:true
    },
    profile_link:{

        type:String,
        require:true
    },
    score:{
        type:Number,
        require:true
        
    },
    date:{
        type:Date,
        default :Date.now
    }
    
})

module.exports = NewUser = mongoose.model("users",newuserschema);