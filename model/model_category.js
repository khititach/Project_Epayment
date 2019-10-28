const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const model_category = new Schema({
    food_storeNO:{ type: Number, required:true },
    food_storeName:{ type: String, required:true },
    food_name:{ type: String, required:true },
    // food_price:{ type: Number, required:true }, // test **
    food_type:{ type:String }, // drink or food or snack or noodle
    food_normal:{ 
        price: { type:Number },
        shotcut: { type:String }
    },
    food_extra:{ 
        price: { type:Number },
        shotcut: { type:String }
    }, 
    food_calories:{ type: Number, required:true },
    // food_image_url:{ type:String },
});

module.exports = mongoose.model('Category',model_category);