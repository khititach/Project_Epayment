const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Model student history
const userSchemaStudent = new Schema({
    // student side
    idcard:{ type: String },
    stuID:{ type: String },
    date:{ type: Date, default: Date.now },
    // time : { type : String},
    activity:{ type:String },
    deposit:{ type:Number },
    withdraw:{ type:Number },
    total:{ type:Number },
    responsible:{ type:String },

});

// Model student history
const userSchemaStore = new Schema({
    storeNO:{ type: String, require: true },
    storeOwn:{ type: String, require: true },
    date:{ type: Date, default: Date.now },
    activity:{ type:String },
    deposit:{ type:Number }
    // total:{ type:Number }
});

var modelStudent = mongoose.model("Studenthistory",userSchemaStudent);
var modelStore = mongoose.model("Storehistory",userSchemaStore);

module.exports = { modelStudent:modelStudent,
                    modelStore:modelStore };
