const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const UserSchema = new Schema({
    storeOwner:{ type: String, required:true, unique:true},
    storeNO:{ type: Number, required:true, unique:true },
    storeName: { type: String, required:true },
    email: String,
    tel: { type: String, required:true },
});

module.exports = mongoose.model('Store',UserSchema);