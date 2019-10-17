const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const model_categoty = new Schema({
    food_name:{ type: String, required:true },
    // food_price:{ type: Number, required:true }, // test **
    food_calories:{ type: Number, required:true },
    food_storeNO:{ type: Number, required:true },
    food_type:{ type:String }, // drink or food or snack or noodle
    food_extra:{ 
        price: { type:Number },
        extra: { type:Boolean }
    }, // 1 - normal / 2 - extra **
    food_image_url:{ type:String },
    food_shotcut:{ type:String }
});

module.exports = mongoose.model('Category',model_categoty);