const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema({
    username:{ type:String, unique:true, require:true },
    password: String,
    name:{ type:String, unique:true },
    role:{ type:String, default: "student" },
});

userSchema.statics.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10),null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.isStudent = function() {
    return (this.role === "student");
};

userSchema.methods.isStore = function() {
    return (this.role === "store");
};

userSchema.methods.isAdmin = function() {
    return (this.role === "admin");
};

module.exports = mongoose.model("User",userSchema);