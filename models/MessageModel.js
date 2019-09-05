const mongoose =require("mongoose");
const  Schema = mongoose.Schema;

const messageModel = new Schema({
    id__: {type: String},
    messages: [{
        message: {type: String},
        messageBy: {type: String}
    }]
});

module.exports = message_Model = mongoose.model("messageModel",messageModel)