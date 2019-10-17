const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    uname:{ type:String, unique:true },
    idcard:{ type: String, require: true , unique:true },
    sex: { type: String, require: true },
    stuID:{ type: String, require: true , unique:true },
    tel: { type: String, require: true },  
    email:{ type: String, require: true },
    money:{ type: Number, require: true }
});

module.exports = mongoose.model('Student',UserSchema);